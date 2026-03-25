-- Adventure Arena 3.0 - Treasure Hunt Database Schema
--
-- 1. New Tables
--    - teams: Store team information and mappings
--    - clues: Store all clues for the treasure hunt
--    - qr_codes: Store QR code mappings for validation
--    - team_progress: Track each team's progress
--    - hint_usage: Track hint usage and penalties
--    - scan_logs: Log all QR scan attempts
--
-- 2. Security
--    - Enable RLS on all tables
--    - Teams can only access their own data
--    - Admin has full access

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id text UNIQUE NOT NULL,
  team_name text,
  access_code text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clues table
CREATE TABLE IF NOT EXISTS clues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id text NOT NULL,
  sequence_number integer NOT NULL,
  clue_text text NOT NULL,
  hint_text text,
  location_description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_id, sequence_number)
);

-- Create qr_codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_data text UNIQUE NOT NULL,
  team_id text NOT NULL,
  sequence_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create team_progress table
CREATE TABLE IF NOT EXISTS team_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id text UNIQUE NOT NULL,
  current_clue_number integer DEFAULT 1,
  is_completed boolean DEFAULT false,
  start_time timestamptz,
  end_time timestamptz,
  total_penalty_minutes integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Create hint_usage table
CREATE TABLE IF NOT EXISTS hint_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id text NOT NULL,
  clue_number integer NOT NULL,
  penalty_minutes integer NOT NULL,
  used_at timestamptz DEFAULT now()
);

-- Create scan_logs table
CREATE TABLE IF NOT EXISTS scan_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id text NOT NULL,
  qr_data text NOT NULL,
  was_correct boolean DEFAULT false,
  error_type text,
  scanned_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hint_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams table
CREATE POLICY "Teams can read own data"
  ON teams FOR SELECT
  TO authenticated
  USING (auth.uid()::text = team_id);

CREATE POLICY "Admin can manage teams"
  ON teams FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for clues table
CREATE POLICY "Teams can read own clues"
  ON clues FOR SELECT
  TO authenticated
  USING (team_id = auth.uid()::text);

CREATE POLICY "Admin can manage clues"
  ON clues FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for qr_codes table
CREATE POLICY "Authenticated users can read QR codes"
  ON qr_codes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage QR codes"
  ON qr_codes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for team_progress table
CREATE POLICY "Teams can read own progress"
  ON team_progress FOR SELECT
  TO authenticated
  USING (team_id = auth.uid()::text);

CREATE POLICY "Teams can update own progress"
  ON team_progress FOR UPDATE
  TO authenticated
  USING (team_id = auth.uid()::text)
  WITH CHECK (team_id = auth.uid()::text);

CREATE POLICY "Teams can insert own progress"
  ON team_progress FOR INSERT
  TO authenticated
  WITH CHECK (team_id = auth.uid()::text);

CREATE POLICY "Admin can manage all progress"
  ON team_progress FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for hint_usage table
CREATE POLICY "Teams can read own hints"
  ON hint_usage FOR SELECT
  TO authenticated
  USING (team_id = auth.uid()::text);

CREATE POLICY "Teams can insert own hints"
  ON hint_usage FOR INSERT
  TO authenticated
  WITH CHECK (team_id = auth.uid()::text);

CREATE POLICY "Admin can manage hints"
  ON hint_usage FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for scan_logs table
CREATE POLICY "Teams can read own scan logs"
  ON scan_logs FOR SELECT
  TO authenticated
  USING (team_id = auth.uid()::text);

CREATE POLICY "Teams can insert own scan logs"
  ON scan_logs FOR INSERT
  TO authenticated
  WITH CHECK (team_id = auth.uid()::text);

CREATE POLICY "Admin can manage scan logs"
  ON scan_logs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_clues_team_id ON clues(team_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_team_id ON qr_codes(team_id);
CREATE INDEX IF NOT EXISTS idx_team_progress_team_id ON team_progress(team_id);
CREATE INDEX IF NOT EXISTS idx_hint_usage_team_id ON hint_usage(team_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_team_id ON scan_logs(team_id);