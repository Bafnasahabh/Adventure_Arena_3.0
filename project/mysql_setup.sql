-- Adventure Arena 3.0 - MySQL setup script (Railway compatible)
-- Drops existing tables to ensure a clean schema, then recreates + seeds sample data.

DROP TABLE IF EXISTS scan_logs;
DROP TABLE IF EXISTS hint_usage;
DROP TABLE IF EXISTS team_progress;
DROP TABLE IF EXISTS qr_codes;
DROP TABLE IF EXISTS clues;
DROP TABLE IF EXISTS teams;

CREATE TABLE teams (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) UNIQUE NOT NULL,
  team_name VARCHAR(100),
  access_code VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE clues (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) NOT NULL,
  sequence_number INT NOT NULL,
  clue_text TEXT NOT NULL,
  hint_text TEXT,
  location_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, sequence_number)
);

CREATE TABLE qr_codes (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  qr_data VARCHAR(100) UNIQUE NOT NULL,
  team_id VARCHAR(50) NOT NULL,
  sequence_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_progress (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) UNIQUE NOT NULL,
  current_clue_number INT DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP NULL,
  end_time TIMESTAMP NULL,
  total_penalty_minutes INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE hint_usage (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  team_id VARCHAR(50) NOT NULL,
  clue_number INT NOT NULL,
  penalty_minutes INT NOT NULL,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scan_logs (
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
CREATE INDEX idx_scan_logs_team_id_scanned_at ON scan_logs(team_id, scanned_at);

-- Seed sample teams
INSERT INTO teams (id, team_id, team_name, access_code, is_active)
VALUES
  (UUID(), 'Team1', NULL, 'code1', true),
  (UUID(), 'Team2', NULL, 'code2', true),
  (UUID(), 'Team3', NULL, 'code3', true),
  (UUID(), 'Team4', NULL, 'code4', true),
  (UUID(), 'Team5', NULL, 'code5', true),
  (UUID(), 'Team6', NULL, 'code6', true),
  (UUID(), 'Team7', NULL, 'code7', true),
  (UUID(), 'Team8', NULL, 'code8', true),
  (UUID(), 'Team9', NULL, 'code9', true),
  (UUID(), 'Team10', NULL, 'code10', true);

-- Seed clues and QR codes for each team (start QR has sequence_number = 0)
INSERT INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES
  (UUID(), 'Team1_start', 'Team1', 0),
  (UUID(), 'Team2_start', 'Team2', 0),
  (UUID(), 'Team3_start', 'Team3', 0),
  (UUID(), 'Team4_start', 'Team4', 0),
  (UUID(), 'Team5_start', 'Team5', 0),
  (UUID(), 'Team6_start', 'Team6', 0),
  (UUID(), 'Team7_start', 'Team7', 0),
  (UUID(), 'Team8_start', 'Team8', 0),
  (UUID(), 'Team9_start', 'Team9', 0),
  (UUID(), 'Team10_start', 'Team10', 0);

-- Clues + QR codes per team
-- (Kept inline for simplicity; the app derives clue count from `clues` table.)

INSERT INTO clues (id, team_id, sequence_number, clue_text, hint_text, location_description) VALUES
  (UUID(), 'Team1', 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station'),
  (UUID(), 'Team1', 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge'),
  (UUID(), 'Team1', 3, 'X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf'),
  (UUID(), 'Team1', 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area'),
  (UUID(), 'Team1', 5, 'Almost there! To the crow''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level'),
  (UUID(), 'Team1', 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''s Desk'),

  (UUID(), 'Team2', 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station'),
  (UUID(), 'Team2', 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge'),
  (UUID(), 'Team2', 3, 'X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf'),
  (UUID(), 'Team2', 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area'),
  (UUID(), 'Team2', 5, 'Almost there! To the crow''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level'),
  (UUID(), 'Team2', 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''s Desk'),

  (UUID(), 'Team3', 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station'),
  (UUID(), 'Team3', 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge'),
  (UUID(), 'Team3', 3, 'X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf'),
  (UUID(), 'Team3', 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area'),
  (UUID(), 'Team3', 5, 'Almost there! To the crow''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level'),
  (UUID(), 'Team3', 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''s Desk'),

  (UUID(), 'Team4', 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station'),
  (UUID(), 'Team4', 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge'),
  (UUID(), 'Team4', 3, 'X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf'),
  (UUID(), 'Team4', 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area'),
  (UUID(), 'Team4', 5, 'Almost there! To the crow''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level'),
  (UUID(), 'Team4', 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''s Desk'),

  (UUID(), 'Team5', 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station'),
  (UUID(), 'Team5', 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge'),
  (UUID(), 'Team5', 3, 'X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf'),
  (UUID(), 'Team5', 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area'),
  (UUID(), 'Team5', 5, 'Almost there! To the crow''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level'),
  (UUID(), 'Team5', 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''s Desk'),

  (UUID(), 'Team6', 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station'),
  (UUID(), 'Team6', 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge'),
  (UUID(), 'Team6', 3, 'X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf'),
  (UUID(), 'Team6', 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area'),
  (UUID(), 'Team6', 5, 'Almost there! To the crow''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level'),
  (UUID(), 'Team6', 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''s Desk'),

  (UUID(), 'Team7', 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station'),
  (UUID(), 'Team7', 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge'),
  (UUID(), 'Team7', 3, 'X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf'),
  (UUID(), 'Team7', 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area'),
  (UUID(), 'Team7', 5, 'Almost there! To the crow''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level'),
  (UUID(), 'Team7', 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''s Desk'),

  (UUID(), 'Team8', 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station'),
  (UUID(), 'Team8', 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge'),
  (UUID(), 'Team8', 3, 'X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf'),
  (UUID(), 'Team8', 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area'),
  (UUID(), 'Team8', 5, 'Almost there! To the crow''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level'),
  (UUID(), 'Team8', 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''s Desk'),

  (UUID(), 'Team9', 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station'),
  (UUID(), 'Team9', 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge'),
  (UUID(), 'Team9', 3, 'X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf'),
  (UUID(), 'Team9', 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area'),
  (UUID(), 'Team9', 5, 'Almost there! To the crow''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level'),
  (UUID(), 'Team9', 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''s Desk'),

  (UUID(), 'Team10', 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station'),
  (UUID(), 'Team10', 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge'),
  (UUID(), 'Team10', 3, 'X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf'),
  (UUID(), 'Team10', 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area'),
  (UUID(), 'Team10', 5, 'Almost there! To the crow''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level'),
  (UUID(), 'Team10', 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''s Desk');

-- Real QR rows:
INSERT INTO qr_codes (id, qr_data, team_id, sequence_number) VALUES
  (UUID(), 'Team1_clue_1', 'Team1', 1),
  (UUID(), 'Team1_clue_2', 'Team1', 2),
  (UUID(), 'Team1_clue_3', 'Team1', 3),
  (UUID(), 'Team1_clue_4', 'Team1', 4),
  (UUID(), 'Team1_clue_5', 'Team1', 5),
  (UUID(), 'Team1_clue_6', 'Team1', 6),

  (UUID(), 'Team2_clue_1', 'Team2', 1),
  (UUID(), 'Team2_clue_2', 'Team2', 2),
  (UUID(), 'Team2_clue_3', 'Team2', 3),
  (UUID(), 'Team2_clue_4', 'Team2', 4),
  (UUID(), 'Team2_clue_5', 'Team2', 5),
  (UUID(), 'Team2_clue_6', 'Team2', 6),

  (UUID(), 'Team3_clue_1', 'Team3', 1),
  (UUID(), 'Team3_clue_2', 'Team3', 2),
  (UUID(), 'Team3_clue_3', 'Team3', 3),
  (UUID(), 'Team3_clue_4', 'Team3', 4),
  (UUID(), 'Team3_clue_5', 'Team3', 5),
  (UUID(), 'Team3_clue_6', 'Team3', 6),

  (UUID(), 'Team4_clue_1', 'Team4', 1),
  (UUID(), 'Team4_clue_2', 'Team4', 2),
  (UUID(), 'Team4_clue_3', 'Team4', 3),
  (UUID(), 'Team4_clue_4', 'Team4', 4),
  (UUID(), 'Team4_clue_5', 'Team4', 5),
  (UUID(), 'Team4_clue_6', 'Team4', 6),

  (UUID(), 'Team5_clue_1', 'Team5', 1),
  (UUID(), 'Team5_clue_2', 'Team5', 2),
  (UUID(), 'Team5_clue_3', 'Team5', 3),
  (UUID(), 'Team5_clue_4', 'Team5', 4),
  (UUID(), 'Team5_clue_5', 'Team5', 5),
  (UUID(), 'Team5_clue_6', 'Team5', 6),

  (UUID(), 'Team6_clue_1', 'Team6', 1),
  (UUID(), 'Team6_clue_2', 'Team6', 2),
  (UUID(), 'Team6_clue_3', 'Team6', 3),
  (UUID(), 'Team6_clue_4', 'Team6', 4),
  (UUID(), 'Team6_clue_5', 'Team6', 5),
  (UUID(), 'Team6_clue_6', 'Team6', 6),

  (UUID(), 'Team7_clue_1', 'Team7', 1),
  (UUID(), 'Team7_clue_2', 'Team7', 2),
  (UUID(), 'Team7_clue_3', 'Team7', 3),
  (UUID(), 'Team7_clue_4', 'Team7', 4),
  (UUID(), 'Team7_clue_5', 'Team7', 5),
  (UUID(), 'Team7_clue_6', 'Team7', 6),

  (UUID(), 'Team8_clue_1', 'Team8', 1),
  (UUID(), 'Team8_clue_2', 'Team8', 2),
  (UUID(), 'Team8_clue_3', 'Team8', 3),
  (UUID(), 'Team8_clue_4', 'Team8', 4),
  (UUID(), 'Team8_clue_5', 'Team8', 5),
  (UUID(), 'Team8_clue_6', 'Team8', 6),

  (UUID(), 'Team9_clue_1', 'Team9', 1),
  (UUID(), 'Team9_clue_2', 'Team9', 2),
  (UUID(), 'Team9_clue_3', 'Team9', 3),
  (UUID(), 'Team9_clue_4', 'Team9', 4),
  (UUID(), 'Team9_clue_5', 'Team9', 5),
  (UUID(), 'Team9_clue_6', 'Team9', 6),

  (UUID(), 'Team10_clue_1', 'Team10', 1),
  (UUID(), 'Team10_clue_2', 'Team10', 2),
  (UUID(), 'Team10_clue_3', 'Team10', 3),
  (UUID(), 'Team10_clue_4', 'Team10', 4),
  (UUID(), 'Team10_clue_5', 'Team10', 5),
  (UUID(), 'Team10_clue_6', 'Team10', 6);

