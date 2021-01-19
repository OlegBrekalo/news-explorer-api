const createError = require('http-errors');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw createError(401, 'Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    const { NODE_ENV, JWT_SECRET } = process.env;
    const salt = NODE_ENV === 'production' ? JWT_SECRET : 'super-dev-key';

    let payload;
    try {
      payload = jwt.verify(token, salt);
    } catch (err) {
      throw createError(401, 'Необходима авторизация');
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
