export type TaskStatus = "pending" | "completed";

export interface Task {
  taskId: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskFilterParams = {
  status: TaskStatus | "";
  search: string;
  limit: number;
  offset: number;
};

export type CreateTaskData = {
  title: string;
  description?: string;
};
