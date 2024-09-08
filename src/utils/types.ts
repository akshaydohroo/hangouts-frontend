export class ErrorDetails extends Error {
  errorCode?: number = 500;
  constructor(
    name: string,
    message: string,
    errorCode?: number,
    cause?: string
  ) {
    super(message, { cause });
    this.errorCode = errorCode;
    this.name = name;
  }
}