import os

sql = """-- Adventure Arena 3.0 - MySQL Setup Script

CREATE TABLE IF NOT EXISTS teams (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) UNIQUE NOT NULL,
  team_name VARCHAR(100),
  access_code VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clues (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) NOT NULL,
  sequence_number INT NOT NULL,
  clue_text TEXT NOT NULL,
  hint_text TEXT,
  location_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, sequence_number)
);

CREATE TABLE IF NOT EXISTS qr_codes (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  qr_data VARCHAR(100) UNIQUE NOT NULL,
  team_id VARCHAR(50) NOT NULL,
  sequence_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_progress (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) UNIQUE NOT NULL,
  current_clue_number INT DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP NULL,
  end_time TIMESTAMP NULL,
  total_penalty_minutes INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hint_usage (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) NOT NULL,
  clue_number INT NOT NULL,
  penalty_minutes INT NOT NULL,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scan_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) NOT NULL,
  qr_data VARCHAR(100) NOT NULL,
  was_correct BOOLEAN DEFAULT FALSE,
  error_type VARCHAR(100),
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clues_team_id ON clues(team_id);
CREATE INDEX idx_qr_codes_team_id ON qr_codes(team_id);
CREATE INDEX idx_team_progress_team_id ON team_progress(team_id);
CREATE INDEX idx_hint_usage_team_id ON hint_usage(team_id);
CREATE INDEX idx_scan_logs_team_id ON scan_logs(team_id);

DELETE FROM scan_logs;
DELETE FROM team_progress;
DELETE FROM qr_codes;
DELETE FROM clues;
DELETE FROM teams;

"""

teams = []
for i in range(1, 11):
    teams.append(f"INSERT IGNORE INTO teams (id, team_id, team_name, access_code, is_active) VALUES (UUID(), 'Team{i}', NULL, 'code{i}', true);")
sql += "\n".join(teams) + "\n\n"

clues = [
    (1, "Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.", "Think about where drinks or cups are kept.", "Beverage Station"),
    (2, "Follow the sea breeze! To the place where the crew gathers to exchange tales.", "Look for a common gathering area or lounge.", "Common Lounge"),
    (3, "X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.", "A bookshelf or a cabinet where documents are kept.", "Library/Bookshelf"),
    (4, "Beware the sirens! Seek the shiny reflection that looks back at you.", "A mirror in the hallway or restroom.", "Mirror Area"),
    (5, "Almost there! To the crow''s nest, where you can see the whole deck.", "The highest point in the room or a balcony.", "Balcony or Upper Level"),
    (6, "The final treasure awaits! Where the captain rests his head after a long voyage.", "Look in the main office or the most comfortable chair.", "Captain''s Desk")
]

for i in range(1, 11):
    t = f"Team{i}"
    # QR Start
    sql += f"INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), '{t}_start', '{t}', 0);\n"
    for c in clues:
        sql += f"INSERT IGNORE INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES (UUID(), '{t}', {c[0]}, '{c[1]}', '{c[2]}', '{c[3]}');\n"
        sql += f"INSERT IGNORE INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES (UUID(), '{t}_clue_{c[0]}', '{t}', {c[0]});\n"
    sql += "\n"

with open(r'C:\Users\shrey\.gemini\antigravity\brain\3a98877a-5dcb-4e45-b132-0e47e69e9c95\mysql_setup.sql', 'w') as f:
    f.write(sql)
