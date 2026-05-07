import pg, { sql } from "./_clients/pg";

export interface Task {
  taskId: number;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface FindAllOptions {
  filters: {
    status?: string;
    search?: string;
  };
  limit: number;
  offset: number;
}

interface FindAllResult {
  rows: Task[];
  total: number;
}

interface CreateData {
  title: string;
  description?: string;
}

interface UpdateOptions {
  taskId: number;
  status: string;
}

export default { findAll, create, update, remove };

async function findAll(options: FindAllOptions): Promise<FindAllResult> {
  const { filters, limit, offset } = options;
  const conditions: string[] = [sql`deleted_at IS NULL`];
  const values: unknown[] = [];

  if (filters.status) {
    values.push(filters.status);
    conditions.push(sql`status = $${values.length}`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(
      sql`(title ILIKE $${values.length} OR description ILIKE $${values.length})`
    );
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const countValues = [...values];

  const countQuery = sql`SELECT COUNT(*) as total FROM tasks ${whereClause}`;

  values.push(limit);
  const limitParam = `$${values.length}`;
  values.push(offset);
  const offsetParam = `$${values.length}`;

  const dataQuery = sql`
    SELECT
      task_id as "taskId",
      title,
      description,
      status,
      created_at::text as "createdAt",
      updated_at::text as "updatedAt"
    FROM tasks
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ${limitParam} OFFSET ${offsetParam}
  `;

  const [countResult, dataResult] = await Promise.all([
    pg.query(countQuery, countValues),
    pg.query(dataQuery, values)
  ]);
  const total = parseInt(countResult.rows[0].total, 10);
  return { rows: dataResult.rows, total };
}

async function create(data: CreateData): Promise<Task> {
  const values: unknown[] = [data.title];
  const columns = ["title"];
  const placeholders = [`$${values.length}`];

  if (data.description !== undefined) {
    values.push(data.description);
    columns.push("description");
    placeholders.push(`$${values.length}`);
  }

  const query = sql`
    INSERT INTO tasks (${columns.join(", ")})
    VALUES (${placeholders.join(", ")})
    RETURNING
      task_id as "taskId",
      title,
      description,
      status,
      created_at::text as "createdAt",
      updated_at::text as "updatedAt"
  `;

  const result = await pg.query(query, values);
  return result.rows[0];
}

async function update(options: UpdateOptions): Promise<Task | null> {
  const { taskId, status } = options;

  const query = sql`
    UPDATE tasks
    SET status = $1, updated_at = NOW()
    WHERE task_id = $2 AND deleted_at IS NULL
    RETURNING
      task_id as "taskId",
      title,
      description,
      status,
      created_at::text as "createdAt",
      updated_at::text as "updatedAt"
  `;

  const result = await pg.query(query, [status, taskId]);
  return result.rows[0] ?? null;
}

async function remove(taskId: number): Promise<boolean> {
  const query = sql`
    UPDATE tasks
    SET deleted_at = NOW()
    WHERE task_id = $1 AND deleted_at IS NULL
  `;
  const result = await pg.query(query, [taskId]);
  return (result.rowCount ?? 0) > 0;
}
