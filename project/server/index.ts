import express from 'express';
import cors from 'cors';
import pool from './db';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- AUTH ---
app.post('/api/auth/login', async (req, res) => {
  const { teamId, accessCode } = req.body;
  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM teams WHERE team_id = ? AND access_code = ? AND is_active = true',
      [teamId, accessCode]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/teams/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM teams WHERE team_id = ?', [req.params.id]);
    res.json(rows[0] || null);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN ---
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const [teams]: any = await pool.query('SELECT * FROM teams');
    const [progress]: any = await pool.query('SELECT * FROM team_progress');
    res.json({ teams, progress });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/reset/:teamId', async (req, res) => {
  const { teamId } = req.params;
  try {
    if (teamId === 'all') {
      await pool.query('DELETE FROM team_progress');
      await pool.query('DELETE FROM hint_usage');
      await pool.query('DELETE FROM scan_logs');
    } else {
      await pool.query('DELETE FROM team_progress WHERE team_id = ?', [teamId]);
      await pool.query('DELETE FROM hint_usage WHERE team_id = ?', [teamId]);
      await pool.query('DELETE FROM scan_logs WHERE team_id = ?', [teamId]);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- TEAM GAME ---
app.get('/api/game/data/:teamId', async (req, res) => {
  const { teamId } = req.params;
  try {
    const [progressRows]: any = await pool.query('SELECT * FROM team_progress WHERE team_id = ?', [teamId]);
    const [clueRows]: any = await pool.query('SELECT * FROM clues WHERE team_id = ? ORDER BY sequence_number ASC', [teamId]);
    const [hintRows]: any = await pool.query('SELECT * FROM hint_usage WHERE team_id = ?', [teamId]);
    const [scanRows]: any = await pool.query('SELECT * FROM scan_logs WHERE team_id = ? ORDER BY scanned_at DESC', [teamId]);

    let progress = progressRows[0];
    if (!progress) {
      // Create initial progress in "not started" state.
      await pool.query(
        'INSERT IGNORE INTO team_progress (team_id, current_clue_number, is_completed, start_time, total_penalty_minutes) VALUES (?, 1, false, NULL, 0)',
        [teamId]
      );
      const [newP]: any = await pool.query('SELECT * FROM team_progress WHERE team_id = ?', [teamId]);
      progress = newP[0];
    }

    res.json({
      progress,
      clues: clueRows,
      hints: hintRows,
      scans: scanRows
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/game/scan', async (req, res) => {
  const { teamId, qrData } = req.body;
  try {
    // Always read progress from DB to prevent client tampering/mismatches.
    const [progressRows]: any = await pool.query('SELECT start_time, current_clue_number FROM team_progress WHERE team_id = ?', [teamId]);
    if (!progressRows[0]) {
      await pool.query(
        'INSERT IGNORE INTO team_progress (team_id, current_clue_number, is_completed, start_time, total_penalty_minutes) VALUES (?, 1, false, NULL, 0)',
        [teamId]
      );
    }

    const [dbProgressRows]: any = await pool.query('SELECT start_time, current_clue_number FROM team_progress WHERE team_id = ?', [teamId]);
    const dbProgress = dbProgressRows[0];
    const hasStarted = !!dbProgress?.start_time && !String(dbProgress.start_time).startsWith('0000-00-00');
    const currentClueNumber = dbProgress?.current_clue_number ?? 1;

    const [qrRows]: any = await pool.query('SELECT * FROM qr_codes WHERE qr_data = ?', [qrData]);
    const qrCode = qrRows[0];

    if (!qrCode) {
      await pool.query('INSERT INTO scan_logs (team_id, qr_data, was_correct, error_type) VALUES (?, ?, false, "invalid_qr")', [teamId, qrData]);
      return res.status(400).json({ error: 'Invalid QR code.' });
    }

    if (qrCode.team_id !== teamId) {
      await pool.query('INSERT INTO scan_logs (team_id, qr_data, was_correct, error_type) VALUES (?, ?, false, "wrong_team")', [teamId, qrData]);
      return res.status(400).json({ error: 'This QR code belongs to another team.' });
    }

    if (qrCode.sequence_number === 0) {
      if (!hasStarted && currentClueNumber === 1) {
        await pool.query('UPDATE team_progress SET start_time = NOW() WHERE team_id = ?', [teamId]);
        await pool.query('INSERT INTO scan_logs (team_id, qr_data, was_correct) VALUES (?, ?, true)', [teamId, qrData]);
        return res.json({ success: true, message: 'Hunt started!' });
      }
      return res.status(400).json({ error: 'Already started.' });
    }

    // Block clue scans until the starting QR is scanned correctly.
    if (!hasStarted) {
      return res.status(400).json({ error: 'Please scan your starting QR code first.' });
    }

    if (qrCode.sequence_number !== currentClueNumber) {
      await pool.query('INSERT INTO scan_logs (team_id, qr_data, was_correct, error_type) VALUES (?, ?, false, "wrong_sequence")', [teamId, qrData]);
      return res.status(400).json({ error: 'Wrong clue sequence.' });
    }

    // Correct clue!
    await pool.query('INSERT INTO scan_logs (team_id, qr_data, was_correct) VALUES (?, ?, true)', [teamId, qrData]);

    // Check if it's the last clue
    const [clueCountRows]: any = await pool.query('SELECT COUNT(*) as count FROM clues WHERE team_id = ?', [teamId]);
    const totalClues = clueCountRows[0].count;

    if (currentClueNumber >= totalClues) {
      await pool.query('UPDATE team_progress SET is_completed = true, end_time = NOW() WHERE team_id = ?', [teamId]);
      return res.json({ success: true, completed: true });
    } else {
      await pool.query('UPDATE team_progress SET current_clue_number = current_clue_number + 1 WHERE team_id = ?', [teamId]);
      return res.json({ success: true, completed: false, nextClue: currentClueNumber + 1 });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/game/hint', async (req, res) => {
  const { teamId, clueNumber, penaltyMinutes } = req.body;
  try {
    await pool.query('INSERT INTO hint_usage (team_id, clue_number, penalty_minutes) VALUES (?, ?, ?)', [teamId, clueNumber, penaltyMinutes]);
    await pool.query('UPDATE team_progress SET total_penalty_minutes = total_penalty_minutes + ? WHERE team_id = ?', [penaltyMinutes, teamId]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// In production, serve the Vite frontend build from `../dist`.
// Note: this must be added AFTER all API routes so `/api/*` doesn't get captured.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/(.*)/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
