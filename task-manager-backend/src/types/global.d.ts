declare namespace NodeJS {
  interface ProcessEnv {
    APP_PORT: string;
    PG_CONNECTION_STRING: string;
    NODE_ENV: string;
    CORS_ORIGIN: string;
  }
}

declare namespace Express {
  interface Response {
    success: (data: unknown) => void;
    wrong: (options?: {
      statusCode?: number;
      code?: string;
      details?: string;
    }) => void;
    notFound: (details?: string) => void;
    conflict: (details?: string) => void;
  }

  interface Locals {
    _successDataSchema?: import("zod").ZodSchema;
  }
}
