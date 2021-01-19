const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// sign-up
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => {
      res.send({ _id: user._id, name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.message.startsWith('E11000 duplicate key')) {
        next(createError(409, `Такой email уже зарегистрирован. Err = ${err}`));
      }

      if (err.name === 'ValidationError') {
        next(createError(400, `Ошибка валидации. Err = ${err}`));
      } else {
        next(createError(`Ошибка сохранения пользователя.`));
      }
    });
};

// sign-in
module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw createError(401, 'Логин или пароль не верен');
      }
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          throw createError(401, 'Логин или пароль не верен');
        }
        const { NODE_ENV, JWT_SECRET } = process.env;
        const salt = NODE_ENV === 'production' ? JWT_SECRET : 'super-dev-key';
        const token = jwt.sign({ _id: user._id }, salt, { expiresIn: '7d' });
        res.send({ token });
      });
    })
    .catch((err) => {
      switch (err.name) {
        case 'UnauthorizedError':
          next(err);
          break;
        default:
          next(createError('Ошибка авторизации.'));
          break;
      }
    });
};
