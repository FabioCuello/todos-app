import express from "express";
import tasksController from "./controllers/tasks";
import { corsMiddleware, errorHandler } from "./utils/index";

export function createApp() {
  const app = express();

  app.set("trust proxy", true);
  app.use(corsMiddleware);
  app.use(express.json({ limit: "10mb" }));

  app.use("/api/v1/tasks", tasksController);

  app.get("/health", (_req, res) => {
    res.success({ status: "ok" });
  });

  app.use(errorHandler);

  const port = parseInt(process.env.APP_PORT || "3001", 10);
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  return server;
}
