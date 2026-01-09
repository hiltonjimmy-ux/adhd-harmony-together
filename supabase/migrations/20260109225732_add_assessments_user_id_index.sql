/*
  # Add Index for Foreign Key Performance

  1. Performance Optimization
    - Add index on `assessments.user_id` column to improve query performance
    - This index covers the foreign key constraint `assessments_user_id_fkey`
    - Enhances performance for lookups, joins, and cascade operations

  2. Benefits
    - Faster queries when filtering assessments by user
    - Improved performance for authentication-based queries
    - Better performance for CASCADE operations on user deletion
*/

-- Add index on user_id column if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
