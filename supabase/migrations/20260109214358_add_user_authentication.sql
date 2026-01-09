/*
  # Add User Authentication

  1. Changes to assessments table
    - Add `user_id` column (uuid, foreign key to auth.users)
    - Make user_id required for new records
  
  2. Security Updates
    - Update RLS policies to ensure users can only access their own assessments
    - Users can only read/update/delete their own assessments
    - Users can only read their own scores
*/

-- Add user_id column to assessments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assessments' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE assessments ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS assessments_user_id_idx ON assessments(user_id);
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create assessments" ON assessments;
DROP POLICY IF EXISTS "Users can read assessments" ON assessments;
DROP POLICY IF EXISTS "Users can update assessments" ON assessments;
DROP POLICY IF EXISTS "Users can delete assessments" ON assessments;

DROP POLICY IF EXISTS "Users can create scores" ON scores;
DROP POLICY IF EXISTS "Users can read scores" ON scores;
DROP POLICY IF EXISTS "Users can update scores" ON scores;
DROP POLICY IF EXISTS "Users can delete scores" ON scores;

-- Create new policies for assessments
CREATE POLICY "Users can create own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
  ON assessments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
  ON assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create new policies for scores (via assessment ownership)
CREATE POLICY "Users can create scores for own assessments"
  ON scores FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = scores.assessment_id
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read scores for own assessments"
  ON scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = scores.assessment_id
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update scores for own assessments"
  ON scores FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = scores.assessment_id
      AND assessments.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = scores.assessment_id
      AND assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete scores for own assessments"
  ON scores FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = scores.assessment_id
      AND assessments.user_id = auth.uid()
    )
  );
