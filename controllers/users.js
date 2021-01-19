const createError = require('http-errors');
const User = require('../models/user');

// # возвращает информацию о пользователе (email и имя)
module.exports.getMyself = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw createError(404, `Пользователь не найден.`);
      }
      res.send(user);
    })
    .catch((err) => {
      switch (err.name) {
        case 'NotFoundError':
          next(err);
          break;
        case 'CastError':
          next(createError(400, 'Некоректный ID пользователя'));
          break;
        default:
          next(createError(`Ошибка чтения пользователя.`));
          break;
      }
    });
};
