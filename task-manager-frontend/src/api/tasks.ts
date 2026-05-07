import { get, post, patch, del } from "@/api/client";
import type { Task, TaskFilterParams, CreateTaskData } from "@/types/task";

export const fetchTasks = (filters: TaskFilterParams) =>
  get<{ tasks: Task[]; total: number }>("/api/v1/tasks", {
    status: filters.status || undefined,
    search: filters.search || undefined,
    limit: filters.limit,
    offset: filters.offset
  });

export const createTask = (data: CreateTaskData) =>
  post<Task>("/api/v1/tasks", data);

export const completeTask = (taskId: number) =>
  patch<null>(`/api/v1/tasks/${taskId}/complete`);

export const pendingTask = (taskId: number) =>
  patch<null>(`/api/v1/tasks/${taskId}/pending`);

export const deleteTask = (taskId: number) =>
  del<null>(`/api/v1/tasks/${taskId}`);
