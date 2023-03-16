const jwt = require('jsonwebtoken');
const { UNATHORIZED, KEY } = require('../app');
const UnathorizedError = require('../errors/unathorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnathorizedError("Необходима авторизация"));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, KEY);
  } catch (err) {
    return next(new UnathorizedError("Неверная подпись токена"));
  }

  req.user = payload;
  next();
};