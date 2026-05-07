import tasksRepo from "../repositories/tasks";
import type { FindAllOptions } from "../repositories/tasks";
import { ServiceError, SERVICE_ERRORS } from "./utils/serviceError";

interface CreateData {
  title: string;
  description?: string;
}

export default { findAll, create, markComplete, markPending, remove };

async function findAll(options: FindAllOptions) {
  const result = await tasksRepo.findAll(options);
  return {
    tasks: result.rows,
    total: result.total
  };
}

async function create(data: CreateData) {
  return await tasksRepo.create(data);
}

async function markComplete(taskId: number) {
  const task = await tasksRepo.update({ taskId, status: "completed" });

  if (!task) {
    throw new ServiceError(
      SERVICE_ERRORS.TASK_NOT_FOUND,
      `Task with id ${taskId} not found`
    );
  }

  return task;
}

async function markPending(taskId: number) {
  const task = await tasksRepo.update({ taskId, status: "pending" });

  if (!task) {
    throw new ServiceError(
      SERVICE_ERRORS.TASK_NOT_FOUND,
      `Task with id ${taskId} not found`
    );
  }

  return task;
}

async function remove(taskId: number) {
  const deleted = await tasksRepo.remove(taskId);

  if (!deleted) {
    throw new ServiceError(
      SERVICE_ERRORS.TASK_NOT_FOUND,
      `Task with id ${taskId} not found`
    );
  }
}
