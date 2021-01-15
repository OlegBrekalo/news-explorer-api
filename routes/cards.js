const { celebrate, Joi } = require('celebrate');
const cardsRouter = require('express').Router();
const parserJSON = require('body-parser').json();

const { getCards, postCard, deleteCardbyID, putLike, deleteLike } = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post(
  '/',
  parserJSON,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri(),
    }),
  }),
  postCard
);
cardsRouter.delete(
  '/:id',
  parserJSON,
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  deleteCardbyID
);
cardsRouter.put(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  putLike
);
cardsRouter.delete(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  deleteLike
);

module.exports = cardsRouter;
