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
  ('Seed Pending Alpha', 'First pending seed task', 'pending'),
  ('Seed Pending Beta', 'Second pending seed task', 'pending'),
  ('Seed Completed Alpha', 'First completed seed task', 'completed'),
  ('Seed Completed Beta', 'Second completed seed task', 'completed'),
  ('Seed Searchable', 'Contains unique keyword qwerty for search tests', 'pending');
