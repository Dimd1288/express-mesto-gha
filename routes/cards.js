const router = require('express').Router();
const {
 getCards, createCard, deleteCard, setCardLike, deleteCardLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', setCardLike);

router.delete('/:cardId/likes', deleteCardLike);

module.exports = router;
