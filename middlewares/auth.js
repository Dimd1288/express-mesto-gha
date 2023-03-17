const jwt = require('jsonwebtoken');
const { KEY } = require('../utils/constants');
const UnathorizedError = require('../errors/unathorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnathorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, KEY);
  } catch (err) {
    return next(new UnathorizedError('Неверная подпись токена'));
  }

  req.user = payload;
  return next();
};
