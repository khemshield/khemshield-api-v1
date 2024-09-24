type ErrorInfoType = {
  code: number;
};

export class CustomError extends Error {
  errorInfo: ErrorInfoType;

  constructor(message: string, errorInfo: ErrorInfoType) {
    super(message);
    this.errorInfo = errorInfo;

    // Ensure the name of the error is the same as the class name
    this.name = this.constructor.name;

    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
