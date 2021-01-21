const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
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
      link: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Поле link должно быть ссылкой');
        }),
      image: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (
            validator.isURL(value) &&
            (value.endsWith('.jpg') || value.endsWith('.png') || value.endsWith('.gif'))
          ) {
            return value;
          }
          return helpers.message('Поле image должно быть ссылкой на изображение');
        }),
    }),
  }),
  postArticle
);

articleRouter.delete(
  '/:id',
  parserJSON,
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().custom((value, helpers) => {
        if (validator.isMongoId(value)) {
          return value;
        }
        return helpers.message('Некорректный ID статьи');
      }),
    }),
  }),
  deleteArticleByID
);

module.exports = articleRouter;
