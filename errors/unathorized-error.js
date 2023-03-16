const { UNATHORIZED } = require('../app');

class UnathorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNATHORIZED;
  }
}

module.exports = UnathorizedError;
