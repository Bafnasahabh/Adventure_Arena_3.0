-- CLEAR EXISTING DATA
DELETE FROM scan_logs;
DELETE FROM team_progress;
DELETE FROM qr_codes;
DELETE FROM clues;
DELETE FROM teams;

-- Insert 10 Pirate Teams
INSERT INTO teams (team_id, team_name, access_code, is_active) VALUES
  ('Team1', NULL, 'code1', true),
  ('Team2', NULL, 'code2', true),
  ('Team3', NULL, 'code3', true),
  ('Team4', NULL, 'code4', true),
  ('Team5', NULL, 'code5', true),
  ('Team6', NULL, 'code6', true),
  ('Team7', NULL, 'code7', true),
  ('Team8', NULL, 'code8', true),
  ('Team9', NULL, 'code9', true),
  ('Team10', NULL, 'code10', true)
ON CONFLICT (team_id) DO NOTHING;

DO $$
DECLARE
  team_rec RECORD;
BEGIN
  FOR team_rec IN SELECT team_id FROM teams LOOP
    -- Start QR
    INSERT INTO qr_codes (qr_data, team_id, sequence_number)
    VALUES (team_rec.team_id || '_start', team_rec.team_id, 0)
    ON CONFLICT (qr_data) DO NOTHING;

    -- Clue 1
    INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description)
    VALUES (team_rec.team_id, 1, 'Look carefully! Where the captain keeps his beverages, seek the spot beneath your thumb.', 'Think about where drinks or cups are kept.', 'Beverage Station') 
    ON CONFLICT (team_id, sequence_number) DO NOTHING;
    INSERT INTO qr_codes (qr_data, team_id, sequence_number) VALUES (team_rec.team_id || '_clue_1', team_rec.team_id, 1) ON CONFLICT (qr_data) DO NOTHING;

    -- Clue 2
    INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description)
    VALUES (team_rec.team_id, 2, 'Follow the sea breeze! To the place where the crew gathers to exchange tales.', 'Look for a common gathering area or lounge.', 'Common Lounge') 
    ON CONFLICT (team_id, sequence_number) DO NOTHING;
    INSERT INTO qr_codes (qr_data, team_id, sequence_number) VALUES (team_rec.team_id || '_clue_2', team_rec.team_id, 2) ON CONFLICT (qr_data) DO NOTHING;

    -- Clue 3
    INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description)
    VALUES (team_rec.team_id, 3, 'X marks the spot! Where the ship''s logs are safely stored away from the ocean spray.', 'A bookshelf or a cabinet where documents are kept.', 'Library/Bookshelf') 
    ON CONFLICT (team_id, sequence_number) DO NOTHING;
    INSERT INTO qr_codes (qr_data, team_id, sequence_number) VALUES (team_rec.team_id || '_clue_3', team_rec.team_id, 3) ON CONFLICT (qr_data) DO NOTHING;

    -- Clue 4
    INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description)
    VALUES (team_rec.team_id, 4, 'Beware the sirens! Seek the shiny reflection that looks back at you.', 'A mirror in the hallway or restroom.', 'Mirror Area') 
    ON CONFLICT (team_id, sequence_number) DO NOTHING;
    INSERT INTO qr_codes (qr_data, team_id, sequence_number) VALUES (team_rec.team_id || '_clue_4', team_rec.team_id, 4) ON CONFLICT (qr_data) DO NOTHING;

    -- Clue 5
    INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description)
    VALUES (team_rec.team_id, 5, 'Almost there! To the crow''s nest, where you can see the whole deck.', 'The highest point in the room or a balcony.', 'Balcony or Upper Level') 
    ON CONFLICT (team_id, sequence_number) DO NOTHING;
    INSERT INTO qr_codes (qr_data, team_id, sequence_number) VALUES (team_rec.team_id || '_clue_5', team_rec.team_id, 5) ON CONFLICT (qr_data) DO NOTHING;

    -- Clue 6
    INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description)
    VALUES (team_rec.team_id, 6, 'The final treasure awaits! Where the captain rests his head after a long voyage.', 'Look in the main office or the most comfortable chair.', 'Captain''s Desk') 
    ON CONFLICT (team_id, sequence_number) DO NOTHING;
    INSERT INTO qr_codes (qr_data, team_id, sequence_number) VALUES (team_rec.team_id || '_clue_6', team_rec.team_id, 6) ON CONFLICT (qr_data) DO NOTHING;
  END LOOP;
END $$;
