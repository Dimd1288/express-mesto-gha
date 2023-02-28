const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CREATED = 201;
const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const SERVER_ERROR = 500;

module.exports = {
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  SERVER_ERROR
}

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '63f8b14b28e55dc080fb9434',
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', () => {
  throw new Error('Wrong url');
});

app.use((error, req, res, next) => {
  if (error.message === 'Wrong url') {
    res.status(404).send({ message: error.message });
    next();
  }
});

app.listen(PORT);
