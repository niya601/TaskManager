/*
  # Add subtasks table

  1. New Tables
    - `subtasks`
      - `id` (uuid, primary key)
      - `parent_task_id` (uuid, foreign key to tasks)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `status` (enum: pending, in-progress, done)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `subtasks` table
    - Add policies for authenticated users to manage their own subtasks

  3. Performance
    - Add indexes for common queries
    - Add trigger for auto-updating timestamps
*/

-- Create enum for subtask status
CREATE TYPE public.subtask_status AS ENUM ('pending', 'in-progress', 'done');

-- Create subtasks table
CREATE TABLE IF NOT EXISTS public.subtasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  status public.subtask_status DEFAULT 'pending'::public.subtask_status NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own subtasks" ON public.subtasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subtasks" ON public.subtasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subtasks" ON public.subtasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subtasks" ON public.subtasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS subtasks_parent_task_id_idx ON public.subtasks(parent_task_id);
CREATE INDEX IF NOT EXISTS subtasks_user_id_idx ON public.subtasks(user_id);
CREATE INDEX IF NOT EXISTS subtasks_status_idx ON public.subtasks(status);
CREATE INDEX IF NOT EXISTS subtasks_created_at_idx ON public.subtasks(created_at DESC);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_subtasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating timestamps
CREATE TRIGGER update_subtasks_updated_at
  BEFORE UPDATE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION public.update_subtasks_updated_at();