const createError = require('http-errors');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(() => {
      next(createError(`Ошибка чтения карточек.`));
    });
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => {
      res.send({ data: newCard });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(createError(400, `Ошибка валидации.`));
      } else {
        next(createError(`Ошибка сохранения карточки.`));
      }
    });
};

module.exports.deleteCardbyID = (req, res, next) => {
  const cardID = req.params.id;
  Card.findById(cardID)
    .then((deletedCard) => {
      if (!deletedCard) {
        throw createError(404, `Карточка для удаления не найдена.`);
      }
      if (deletedCard.owner._id.toString() !== req.user._id) {
        throw createError(401, 'Нет прав для удаления карточки');
      }
      return Card.findOneAndDelete({ _id: cardID, owner: req.user._id });
    })
    .then((data) => {
      res.send({ message: `Карточка ${data._id} успешно удалена.` });
    })
    .catch((err) => {
      switch (err.name) {
        case 'UnauthorizedError':
        case 'NotFoundError':
          next(err);
          break;
        case 'CastError':
          next(createError(400, `Некоректный ID карточки.`));
          break;
        default:
          next(createError(`Ошибка при удалении карточки.`));
          break;
      }
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        throw createError(404, `Карточка для дизлайка не найдена.`);
      }
      res.send({ data });
    })
    .catch((err) => {
      switch (err.name) {
        case 'NotFoundError':
          next(err);
          break;
        case 'CastError':
          next(createError(400, `Некорректный ID карточки.`));
          break;
        default:
          next(createError(`Ошибка лайка карточки.`));
          break;
      }
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        throw createError(404, `Карточка для дизлайка не найдена.`);
      }
      res.send({ data });
    })
    .catch((err) => {
      switch (err.name) {
        case 'NotFoundError':
          next(err);
          break;
        case 'CastError':
          next(createError(400, `Некорректный ID карточки.`));
          break;
        default:
          next(createError(`Ошибка дизлайка карточки.`));
          break;
      }
    });
};
