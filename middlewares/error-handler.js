const { SERVER_ERROR } = require('../utils/constants');

module.exports = (error, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = error;
  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};
