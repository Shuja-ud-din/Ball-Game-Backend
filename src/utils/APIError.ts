export class APIError extends Error {
  public status: number;
  public error?: object;

  constructor(message: string, statusCode: number, error?: object) {
    super(message);
    this.status = statusCode;
    this.error = error;

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
