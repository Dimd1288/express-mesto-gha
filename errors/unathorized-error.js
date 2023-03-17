const { UNATHORIZED } = require('../utils/constants');

class UnathorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNATHORIZED;
  }
}

module.exports = UnathorizedError;
