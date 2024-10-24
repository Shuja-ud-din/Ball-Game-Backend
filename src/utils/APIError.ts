export class APIError extends Error {
  public statusCode: number;
  public error?: object;

  constructor(message: string, statusCode: number, error?: object) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
