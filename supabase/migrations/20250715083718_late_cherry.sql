/*
  # Create subtasks table

  1. New Tables
    - `subtasks`
      - `id` (uuid, primary key)
      - `parent_task_id` (uuid, foreign key to tasks)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `status` (enum: pending, in-progress, done)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `subtasks` table
    - Add policies for authenticated users to manage their own subtasks

  3. Triggers
    - Add trigger to automatically update `updated_at` timestamp
*/

-- Create enum for subtask status
CREATE TYPE IF NOT EXISTS subtask_status AS ENUM ('pending', 'in-progress', 'done');

-- Create subtasks table
CREATE TABLE IF NOT EXISTS subtasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  status subtask_status DEFAULT 'pending'::subtask_status NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own subtasks"
  ON subtasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subtasks"
  ON subtasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subtasks"
  ON subtasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subtasks"
  ON subtasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subtasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_subtasks_updated_at
  BEFORE UPDATE ON subtasks
  FOR EACH ROW
  EXECUTE FUNCTION update_subtasks_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS subtasks_parent_task_id_idx ON subtasks(parent_task_id);
CREATE INDEX IF NOT EXISTS subtasks_user_id_idx ON subtasks(user_id);
CREATE INDEX IF NOT EXISTS subtasks_status_idx ON subtasks(status);
CREATE INDEX IF NOT EXISTS subtasks_created_at_idx ON subtasks(created_at DESC);