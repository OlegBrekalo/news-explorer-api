const express = require('express');

const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const createError = require('http-errors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = require('./utils/rateLimiter');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const articleRoutes = require('./routes/article');

dotenv.config();

const app = express();
app.use(limiter);
app.use(helmet());
app.use(cors({ origin: true }));

const { PORT = 4000, DB_PATH = 'mongodb://localhost:27017/newsArticleDB' } = process.env;

mongoose.connect(DB_PATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(requestLogger);

// Unprotected routers for Sign-up and Sign-in
app.use('/', authRoutes);

// Protected routers for other operations
app.use('/users', auth, usersRoutes);
app.use('/article', auth, articleRoutes);
app.use('*', auth, () => {
  throw createError(404, 'Запрашиваемый ресурс не найден');
});

// error handlers
app.use(errorLogger);
app.use(errors()); // celebrate

app.use((error, req, res, next) => {
  const { status = 500, message } = error;
  res.status(status);

  res.json({
    status,
    message,
  });
  next();
});

app.listen(PORT, () => {});
