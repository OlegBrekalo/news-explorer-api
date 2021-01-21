const createError = require('http-errors');
const Article = require('../models/article');

// # возвращает все сохранённые пользователем статьи
module.exports.getAllArticles = (req, res, next) => {
  Article.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      next(createError('Ошибка чтения статей'));
    });
};

// # создаёт статью с переданными в теле
// # keyword, title, text, date, source, link и image
module.exports.postArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;
  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((newArticle) => {
      res.send({
        keyword: newArticle.keyword,
        title: newArticle.title,
        text: newArticle.text,
        date: newArticle.date,
        source: newArticle.source,
        link: newArticle.link,
        image: newArticle.image,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(createError(400, `Ошибка валидации.`));
      } else {
        next(createError(`Ошибка сохранения статьи.`));
      }
    });
};

// # удаляет сохранённую статью  по _id
module.exports.deleteArticleByID = (req, res, next) => {
  const articleID = req.params.id;
  Article.findById(articleID)
    .select('+owner')
    .then((deletedArticle) => {
      if (!deletedArticle) {
        throw createError(404, 'Статья для удаления не найдена');
      }
      if (deletedArticle.owner._id.toString() !== req.user._id) {
        throw createError(403, 'Нет прав для удаления статьи');
      }
      return Article.findByIdAndDelete(articleID);
    })
    .then((data) => {
      res.send({ message: `Статья ${data._id} успешно удалена` });
    })
    .catch((err) => {
      switch (err.name) {
        case 'UnauthorizedError':
        case 'NotFoundError':
          next(err);
          break;
        case 'CastError':
          next(createError(400, `Некоректный ID статьи.`));
          break;
        default:
          next(createError(`Ошибка при удалении статьи.`));
          break;
      }
    });
};
