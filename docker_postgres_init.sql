CREATE TYPE task_status AS ENUM ('pending', 'completed');

CREATE TABLE IF NOT EXISTS tasks (
    task_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_tasks_status ON tasks (status);
CREATE INDEX idx_tasks_deleted_at ON tasks (deleted_at);

INSERT INTO tasks (title, description, status) VALUES
  ('Set up project structure', 'Initialize backend and frontend repositories', 'completed'),
  ('Design database schema', 'Create tasks table with proper indexes', 'completed'),
  ('Implement REST API', 'CRUD endpoints for task management', 'completed'),
  ('Build React UI', 'Task list, form, and filters components', 'pending'),
  ('Add search functionality', 'Search by title and description with ILIKE', 'pending'),
  ('Implement pagination', 'Server-side pagination with limit/offset', 'pending'),
  ('Write E2E tests', 'Playwright tests for core workflows', 'pending'),
  ('Dockerize application', 'Docker Compose with PostgreSQL, backend, and frontend', 'pending');
