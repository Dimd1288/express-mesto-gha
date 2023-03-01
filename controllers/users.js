const User = require('../models/user');
const {
  CREATED, NOT_FOUND, BAD_REQUEST, SERVER_ERROR,
} = require('../app');

class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotFound';
    this.statusCode = NOT_FOUND;
  }
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new UserNotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      if (err instanceof UserNotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true, context: 'query' })
    .orFail(() => {
      throw new UserNotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля пользователя' });
        return;
      }
      if (err instanceof UserNotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true, context: 'query' })
    .orFail(() => {
      throw new UserNotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара пользователя' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
