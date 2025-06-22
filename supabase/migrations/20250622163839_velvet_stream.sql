/*
  # Update user preferences theme options

  1. Changes
    - Update theme column to only allow 'light' and 'classic-dark' values
    - Remove 'dark' and 'system' options to simplify theme selection
    - Update existing 'dark' theme entries to 'classic-dark'

  2. Security
    - Maintains existing RLS policies
    - No changes to user access controls
*/

-- Update existing 'dark' theme entries to 'classic-dark'
UPDATE user_preferences 
SET theme = 'classic-dark' 
WHERE theme = 'dark';

-- Update the check constraint to only allow 'light' and 'classic-dark'
ALTER TABLE user_preferences 
DROP CONSTRAINT IF EXISTS user_preferences_theme_check;

ALTER TABLE user_preferences 
ADD CONSTRAINT user_preferences_theme_check 
CHECK (theme IN ('light', 'classic-dark'));