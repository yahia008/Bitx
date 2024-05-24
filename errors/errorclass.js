class errorclass extends Error {
  constructor(message, status) {
    super(message);
    this.status = status || 300;
    this.isoperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = errorclass;
