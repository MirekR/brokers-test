export class ErrorWithStatusCode extends Error {
  statusCode: number;
  extra?: {};

  constructor(message: string, statusCode: number, extra?: {}) {
    super(message);
    this.statusCode = statusCode;
    this.extra = extra;
  }
}
