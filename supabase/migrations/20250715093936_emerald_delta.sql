/*
  # Add Task Embeddings and Vector Search

  1. New Columns
    - Add `embedding` column to tasks table for storing vector embeddings
    - Add `search_content` column for combined searchable text

  2. Functions
    - Create `search_tasks_by_similarity` function for vector similarity search
    - Create trigger to automatically generate embeddings when tasks are created/updated

  3. Indexes
    - Add vector similarity index for efficient search
*/

-- Enable the vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'embedding'
  ) THEN
    ALTER TABLE tasks ADD COLUMN embedding vector(384);
  END IF;
END $$;

-- Add search_content column for combined searchable text
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'search_content'
  ) THEN
    ALTER TABLE tasks ADD COLUMN search_content text;
  END IF;
END $$;

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS tasks_embedding_idx ON tasks USING ivfflat (embedding vector_cosine_ops);

-- Create function to search tasks by similarity
CREATE OR REPLACE FUNCTION search_tasks_by_similarity(
  query_embedding vector(384),
  user_id uuid,
  match_threshold float DEFAULT 0.3,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  priority text,
  status text,
  start_date date,
  notes text,
  created_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.title,
    t.priority,
    t.status,
    t.start_date,
    t.notes,
    t.created_at,
    (1 - (t.embedding <=> query_embedding)) as similarity
  FROM tasks t
  WHERE 
    t.user_id = search_tasks_by_similarity.user_id
    AND t.embedding IS NOT NULL
    AND (1 - (t.embedding <=> query_embedding)) > match_threshold
  ORDER BY t.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create function to update search content
CREATE OR REPLACE FUNCTION update_task_search_content()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_content := COALESCE(NEW.title, '') || ' ' || 
                       COALESCE(NEW.notes, '') || ' ' || 
                       COALESCE(NEW.priority, '') || ' ' || 
                       COALESCE(NEW.status, '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update search content
DROP TRIGGER IF EXISTS update_task_search_content_trigger ON tasks;
CREATE TRIGGER update_task_search_content_trigger
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_task_search_content();

-- Update existing tasks to have search content
UPDATE tasks 
SET search_content = COALESCE(title, '') || ' ' || 
                    COALESCE(notes, '') || ' ' || 
                    COALESCE(priority, '') || ' ' || 
                    COALESCE(status, '')
WHERE search_content IS NULL;