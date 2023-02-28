const User = require('../models/user');

class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotFound';
    this.statusCode = 404;
  }
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new UserNotFoundError('Пользователи не найдены');
    })
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof UserNotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
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
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      if (err instanceof UserNotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true, context: 'query' })
    .orFail(() => {
      throw new UserNotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      if (!((req.body.name || req.body.about))) {
        throw new Error('Переданы некорректные данные при обновлении профиля пользователя');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof Error) {
        res.status(400).send({ message: err.message });
        return;
      }
      if (err instanceof UserNotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true, context: 'query' })
    .orFail(() => {
      throw new UserNotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      if (!req.body.avatar) {
        throw new Error('Переданы некорректные данные при обновлении аватара пользователя');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof Error) {
        res.status(400).send({ message: err.message });
        return;
      }
      if (err instanceof UserNotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
