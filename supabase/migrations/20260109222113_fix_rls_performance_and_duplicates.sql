/*
  # Fix RLS Performance and Remove Duplicate Policies

  ## Performance Optimizations
  1. Replace `auth.uid()` with `(select auth.uid())` in all policies
     - This prevents re-evaluation of auth functions for each row
     - Significantly improves query performance at scale
  
  ## Security Improvements
  2. Remove duplicate policies that were creating conflicts
     - Keep only user-owned access policies for authenticated users
     - Remove conflicting public/anon policies
  
  ## Index Management
  3. Drop unused indexes that are not being utilized
     - idx_assessments_created_at (not used by current policies)
     - assessments_user_id_idx (covered by foreign key index)

  ## Changes Made
  - Assessments table: 4 policies updated (create, read, update, delete)
  - Scores table: 4 policies updated (create, read, update, delete)
  - All policies now use `(select auth.uid())` for optimal performance
  - Removed all duplicate anon/public policies
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public users can create assessments" ON assessments;
DROP POLICY IF EXISTS "Public users can read recent assessments" ON assessments;
DROP POLICY IF EXISTS "Public users can update recent assessments" ON assessments;
DROP POLICY IF EXISTS "Users can create own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can read own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can update own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can delete own assessments" ON assessments;

DROP POLICY IF EXISTS "Public users can create scores for recent assessments" ON scores;
DROP POLICY IF EXISTS "Public users can read scores for recent assessments" ON scores;
DROP POLICY IF EXISTS "Public users can update scores for recent assessments" ON scores;
DROP POLICY IF EXISTS "Users can create scores for own assessments" ON scores;
DROP POLICY IF EXISTS "Users can read scores for own assessments" ON scores;
DROP POLICY IF EXISTS "Users can update scores for own assessments" ON scores;
DROP POLICY IF EXISTS "Users can delete scores for own assessments" ON scores;

-- Drop unused indexes
DROP INDEX IF EXISTS idx_assessments_created_at;
DROP INDEX IF EXISTS assessments_user_id_idx;

-- Create optimized policies for assessments with (select auth.uid())
CREATE POLICY "Users can create own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can read own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own assessments"
  ON assessments FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own assessments"
  ON assessments FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Create optimized policies for scores with (select auth.uid())
CREATE POLICY "Users can create scores for own assessments"
  ON scores FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = scores.assessment_id
      AND assessments.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can read scores for own assessments"
  ON scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = scores.assessment_id
      AND assessments.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update scores for own assessments"
  ON scores FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = scores.assessment_id
      AND assessments.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = scores.assessment_id
      AND assessments.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete scores for own assessments"
  ON scores FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM assessments
      WHERE assessments.id = scores.assessment_id
      AND assessments.user_id = (select auth.uid())
    )
  );
