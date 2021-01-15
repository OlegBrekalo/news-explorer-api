const { celebrate, Joi } = require('celebrate');
const usersRouter = require('express').Router();
const parserJSON = require('body-parser').json();

const {
  getUsers,
  getMyself,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getMyself);
usersRouter.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  getUserById
);
usersRouter.patch(
  '/me',
  parserJSON,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUserInfo
);
usersRouter.patch(
  '/me/avatar',
  parserJSON,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().uri(),
    }),
  }),
  updateUserAvatar
);

module.exports = usersRouter;
