class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    // Set the name of the error class
    this.name = this.constructor.name;

    // Set the HTTP status code for the error
    this.statusCode = statusCode || 500;

    // Capture the stack trace, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
