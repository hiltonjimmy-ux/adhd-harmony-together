/*
  # ADHD Harmony Together - Assessment System

  1. New Tables
    - `assessments` - Main assessment sessions
      - `id` (uuid, primary key)
      - `partner1_name` (text) - Optional name for Partner 1
      - `partner2_name` (text) - Optional name for Partner 2
      - `partner1_completed` (boolean) - Whether Partner 1 finished
      - `partner2_completed` (boolean) - Whether Partner 2 finished
      - `results_revealed` (boolean) - Whether results viewed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `scores` - Individual ratings for each attribute
      - `id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key)
      - `partner_number` (integer) - Which partner (1 or 2)
      - `attribute_id` (text) - Attribute being rated
      - `score_value` (integer) - Rating from 1-5
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public access policies (anonymous assessment tool)
*/

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner1_name text DEFAULT '',
  partner2_name text DEFAULT '',
  partner1_completed boolean DEFAULT false,
  partner2_completed boolean DEFAULT false,
  results_revealed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  partner_number integer NOT NULL CHECK (partner_number IN (1, 2)),
  attribute_id text NOT NULL,
  score_value integer NOT NULL CHECK (score_value BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(assessment_id, partner_number, attribute_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scores_assessment ON scores(assessment_id);
CREATE INDEX IF NOT EXISTS idx_scores_partner ON scores(partner_number);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Public access policies (anonymous assessment tool)
CREATE POLICY "Anyone can create assessments"
  ON assessments FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read assessments"
  ON assessments FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update assessments"
  ON assessments FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can create scores"
  ON scores FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read scores"
  ON scores FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update scores"
  ON scores FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scores_updated_at
  BEFORE UPDATE ON scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();