const createError = require('http-errors');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => {
      next(createError(`Ошибка чтения пользователей.`));
    });
};

const findUserByID = (id, res, next) => {
  User.findById(id)
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

module.exports.getMyself = (req, res, next) => {
  findUserByID(req.user._id, res, next);
};

module.exports.getUserById = (req, res, next) => {
  findUserByID(req.params.id, res, next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((updatedUser) => {
      res.send({ data: updatedUser });
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          next(createError(400, 'Введенные данные не прошли валидацию'));
          break;
        case 'CastError':
          next(createError(400, `Некоректный ID пользователя.`));
          break;
        default:
          next(createError(`Ошибка обновлении пользователя.`));
          break;
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(createError(400, `Ошибка валидации.`));
      } else {
        next(createError(`Ошибка обновлении пользователя.`));
      }
    });
};
