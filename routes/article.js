const { celebrate, Joi } = require('celebrate');
const articleRouter = require('express').Router();
const parserJSON = require('body-parser').json();

const { getAllArticles, postArticle, deleteArticleByID } = require('../controllers/article');

articleRouter.get('/', getAllArticles);
articleRouter.post(
  '/',
  parserJSON,
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.date().required(),
      source: Joi.string().required(),
      link: Joi.string().required().uri(),
      image: Joi.string().required().uri(),
    }),
  }),
  postArticle
);

articleRouter.delete(
  '/:id',
  parserJSON,
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  deleteArticleByID
);

module.exports = articleRouter;
