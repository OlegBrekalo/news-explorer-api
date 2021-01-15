const { celebrate, Joi } = require('celebrate');

const authRouter = require('express').Router();
const parserJSON = require('body-parser').json();

const { createUser, loginUser } = require('../controllers/auth');

authRouter.post(
  '/signup',
  parserJSON,
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
    }),
  }),
  createUser
);

authRouter.post(
  '/signin',
  parserJSON,
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  loginUser
);

module.exports = authRouter;
