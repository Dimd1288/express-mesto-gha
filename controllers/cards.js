const Card = require('../models/card');

class CardNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CardNotFound';
    this.statusCode = 404;
  }
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new CardNotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof CardNotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.setCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true, context: 'query' },
  )
    .orFail(() => {
      throw new CardNotFoundError('Передан несуществующий _id карточки');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при постановке лайка' });
        return;
      }
      if (err instanceof CardNotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new CardNotFoundError('Передан несуществующий _id карточки');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при удалении лайка' });
        return;
      }
      if (err instanceof CardNotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
