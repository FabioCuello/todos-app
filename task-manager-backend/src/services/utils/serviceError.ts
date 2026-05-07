export const SERVICE_ERRORS = {
  TASK_NOT_FOUND: "TASK_NOT_FOUND"
} as const;

type ServiceErrorCode = (typeof SERVICE_ERRORS)[keyof typeof SERVICE_ERRORS];

export class ServiceError extends Error {
  public code: ServiceErrorCode;

  constructor(code: ServiceErrorCode, message: string) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
  }
}
