import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const cluesPath = path.join(projectRoot, 'clues_data.json');

async function syncClues() {
  try {
    const data = JSON.parse(fs.readFileSync(cluesPath, 'utf8'));
    console.log(`Starting sync for ${data.length} teams...`);

    for (const team of data) {
      console.log(`Syncing team: ${team.team_id}`);
      for (const clue of team.clues) {
        // UPSERT logic: Insert or update if exists
        const [result]: any = await pool.query(
          `INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description) 
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           clue_text = VALUES(clue_text), 
           hint_text = VALUES(hint_text), 
           location_description = VALUES(location_description)`,
          [
            team.team_id,
            clue.sequence_number,
            clue.clue_text,
            clue.hint_text,
            clue.location_description,
          ]
        );
        console.log(`  - Clue ${clue.sequence_number}: ${result.affectedRows > 0 ? 'Updated/Inserted' : 'No change'}`);
      }
    }

    console.log('Sync completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error syncing clues:', err);
    process.exit(1);
  }
}

syncClues();
