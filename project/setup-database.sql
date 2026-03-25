-- Setup script for Adventure Arena 3.0
-- This script creates default teams and sample clues

-- Insert 20 default teams
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
  ('Team10', NULL, 'code10', true),
  ('Team11', NULL, 'code11', true),
  ('Team12', NULL, 'code12', true),
  ('Team13', NULL, 'code13', true),
  ('Team14', NULL, 'code14', true),
  ('Team15', NULL, 'code15', true),
  ('Team16', NULL, 'code16', true),
  ('Team17', NULL, 'code17', true),
  ('Team18', NULL, 'code18', true),
  ('Team19', NULL, 'code19', true),
  ('Team20', NULL, 'code20', true)
ON CONFLICT (team_id) DO NOTHING;

-- Sample clues for each team (5 clues per team)
-- You can customize these clues for your actual treasure hunt

DO $$
DECLARE
  team_rec RECORD;
BEGIN
  FOR team_rec IN SELECT team_id FROM teams LOOP
    -- Clue 1
    INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description)
    VALUES (
      team_rec.team_id,
      1,
      'Where knowledge is stored in rows, seek the place where scholars browse.',
      'Think about where books are kept',
      'Library'
    ) ON CONFLICT (team_id, sequence_number) DO NOTHING;

    -- Clue 2
    INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description)
    VALUES (
      team_rec.team_id,
      2,
      'Where champions are made and sweat is shed, find your next clue where athletes are led.',
      'Sports and fitness location',
      'Gymnasium'
    ) ON CONFLICT (team_id, sequence_number) DO NOTHING;

    -- Clue 3
    INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description)
    VALUES (
      team_rec.team_id,
      3,
      'Beneath the sky where minds convene, seek the spot that''s always green.',
      'Outdoor gathering space',
      'Cafeteria Garden'
    ) ON CONFLICT (team_id, sequence_number) DO NOTHING;

    -- Clue 4
    INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description)
    VALUES (
      team_rec.team_id,
      4,
      'Where experiments unfold and theories are tested, your next clue awaits where science is invested.',
      'Scientific research area',
      'Science Laboratory'
    ) ON CONFLICT (team_id, sequence_number) DO NOTHING;

    -- Clue 5 (Final)
    INSERT INTO clues (team_id, sequence_number, clue_text, hint_text, location_description)
    VALUES (
      team_rec.team_id,
      5,
      'Where knowledge begins its journey each day, find your treasure where wisdom holds sway.',
      'Administrative area',
      'Main Office'
    ) ON CONFLICT (team_id, sequence_number) DO NOTHING;

    -- Generate QR codes for each clue
    INSERT INTO qr_codes (qr_data, team_id, sequence_number)
    VALUES
      (team_rec.team_id || '_clue_1', team_rec.team_id, 1),
      (team_rec.team_id || '_clue_2', team_rec.team_id, 2),
      (team_rec.team_id || '_clue_3', team_rec.team_id, 3),
      (team_rec.team_id || '_clue_4', team_rec.team_id, 4),
      (team_rec.team_id || '_clue_5', team_rec.team_id, 5)
    ON CONFLICT (qr_data) DO NOTHING;
  END LOOP;
END $$;
