import { Router } from "express";
import { z } from "zod";
import tasksService from "../../services/tasks";
import { ServiceError, SERVICE_ERRORS } from "../../services/utils/serviceError";
import { reqSchema, resSchema } from "../utils/index";

const router = Router();

const taskSchema = z.object({
  taskId: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const findAllQuerySchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().default(50),
  offset: z.coerce.number().default(0)
});

const createBodySchema = z.object({
  title: z.string(),
  description: z.string().optional()
});

const taskIdParamsSchema = z.object({
  taskId: z.coerce.number()
});

router.get(
  "/",
  reqSchema({ query: findAllQuerySchema }),
  resSchema({
    success: z.object({
      tasks: z.array(taskSchema),
      total: z.number()
    })
  }),
  async (req, res) => {
    const { status, search, limit, offset } = req.query;

    const result = await tasksService.findAll({
      filters: { status, search },
      limit,
      offset
    });

    res.success(result);
  }
);

router.post(
  "/",
  reqSchema({ body: createBodySchema }),
  resSchema({ success: taskSchema }),
  async (req, res) => {
    const { title, description } = req.body;

    const task = await tasksService.create({ title, description });

    res.status(201).success(task);
  }
);

router.patch(
  "/:taskId/complete",
  reqSchema({ params: taskIdParamsSchema }),
  resSchema({ success: z.null() }),
  async (req, res) => {
    try {
      const { taskId } = req.params;
      await tasksService.markComplete(taskId);
      res.success(null);
    } catch (error) {
      if (
        error instanceof ServiceError &&
        error.code === SERVICE_ERRORS.TASK_NOT_FOUND
      ) {
        return res.notFound(error.message);
      }
      throw error;
    }
  }
);

router.patch(
  "/:taskId/pending",
  reqSchema({ params: taskIdParamsSchema }),
  resSchema({ success: z.null() }),
  async (req, res) => {
    try {
      const { taskId } = req.params;
      await tasksService.markPending(taskId);
      res.success(null);
    } catch (error) {
      if (
        error instanceof ServiceError &&
        error.code === SERVICE_ERRORS.TASK_NOT_FOUND
      ) {
        return res.notFound(error.message);
      }
      throw error;
    }
  }
);

router.delete(
  "/:taskId",
  reqSchema({ params: taskIdParamsSchema }),
  resSchema({ success: z.null() }),
  async (req, res) => {
    try {
      const { taskId } = req.params;
      await tasksService.remove(taskId);
      res.success(null);
    } catch (error) {
      if (
        error instanceof ServiceError &&
        error.code === SERVICE_ERRORS.TASK_NOT_FOUND
      ) {
        return res.notFound(error.message);
      }
      throw error;
    }
  }
);

export default router;
