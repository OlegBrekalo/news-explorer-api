const createError = require('http-errors');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw createError(401, 'Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      throw createError(401, 'Необходима авторизация');
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
