const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const CREATED = 201;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const CONFLICT = 409;
const SERVER_ERROR = 500;
const UNATHORIZED = 401;

module.exports = {
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  BAD_REQUEST,
  CONFLICT,
  SERVER_ERROR,
  UNATHORIZED,
};

module.exports.KEY = '78c2e66de7a6caee1cac2b7821c49c3b';

const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const ValidationError = require('./errors/validation-error');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.all('*', () => {
  throw new ValidationError('Wrong url');
});

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = error;
  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT);
