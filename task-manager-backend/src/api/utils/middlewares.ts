import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  response
} from "express";
import cors from "cors";
import { z } from "zod";
import { ServiceError } from "../../services/utils/serviceError";

response.success = function (data: unknown) {
  const res = this as Response;
  let parsedData = data;

  if (res.locals._successDataSchema) {
    parsedData = res.locals._successDataSchema.parse(data);
  }

  res.status(res.statusCode).json({ data: parsedData, error: null });
};

response.wrong = function (options?: {
  statusCode?: number;
  code?: string;
  details?: string;
}) {
  const res = this as Response;
  const statusCode = options?.statusCode ?? 400;
  const code = options?.code ?? "BAD_REQUEST";
  const details = options?.details ?? "Something went wrong";

  res.status(statusCode).json({
    data: null,
    error: { code, details }
  });
};

response.notFound = function (details?: string) {
  const res = this as Response;
  res.wrong({
    statusCode: 404,
    code: "NOT_FOUND",
    details: details ?? "Resource not found"
  });
};

response.conflict = function (details?: string) {
  const res = this as Response;
  res.wrong({
    statusCode: 409,
    code: "CONFLICT",
    details: details ?? "Resource conflict"
  });
};

export const resSchema = <
  Schema extends {
    success?: z.Schema;
  },
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
  Locals extends Record<string, any> = Record<string, any>
>(
  schema: Schema
) => {
  const middleware: RequestHandler<
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    Locals & { _successDataSchema?: Schema["success"] }
  > = (_, res, next) => {
    if (schema.success) res.locals._successDataSchema = schema.success;
    next();
  };

  return middleware;
};

export const reqSchema = <
  SQuery extends z.Schema,
  SBody extends z.Schema,
  SParams extends z.Schema,
  Schema extends {
    query?: SQuery;
    body?: SBody;
    params?: SParams;
  },
  ResBody = any,
  Locals extends Record<string, any> = Record<string, any>
>(
  schema: Schema
) => {
  const middleware: RequestHandler<
    Schema["params"] extends z.Schema ? z.infer<Schema["params"]> : unknown,
    ResBody,
    Schema["body"] extends z.Schema ? z.infer<Schema["body"]> : unknown,
    Schema["query"] extends z.Schema ? z.infer<Schema["query"]> : unknown,
    Locals
  > = (req, res, next) => {
    if (schema.params) {
      const result = schema.params.safeParse(req.params);

      if (!result.success) {
        res.wrong({
          statusCode: 422,
          code: "INVALID_SCHEMA",
          details: result.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")
        });
        return;
      }

      Object.defineProperty(req, "params", {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }

    if (schema.query) {
      const result = schema.query.safeParse(req.query);

      if (!result.success) {
        res.wrong({
          statusCode: 422,
          code: "INVALID_SCHEMA",
          details: result.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")
        });
        return;
      }

      Object.defineProperty(req, "query", {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }

    if (schema.body) {
      const result = schema.body.safeParse(req.body);

      if (!result.success) {
        res.wrong({
          statusCode: 422,
          code: "INVALID_SCHEMA",
          details: result.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ")
        });
        return;
      }

      Object.defineProperty(req, "body", {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }

    next();
  };

  return middleware;
};

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof SyntaxError) {
    res.wrong({
      statusCode: 400,
      code: "BAD_REQUEST",
      details: "Invalid JSON"
    });
    return;
  }

  if (err instanceof ServiceError) {
    res.wrong({ code: err.code, details: err.message });
    return;
  }

  console.error("Unhandled error:", err);
  res.wrong({
    statusCode: 500,
    code: "INTERNAL_ERROR",
    details: "Internal server error"
  });
}

export const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
});
