const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const createError = require('http-errors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const articleRoutes = require('./routes/article');

const app = express();
app.use(helmet());
app.use(cors({ origin: true }));

const { PORT = 4000, DB_NAME = 'newsArticleDB' } = process.env;

mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
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

app.use('*', () => {
  throw createError(404, 'Запрашиваемый ресурс не найден');
});

// error handlers
app.use(errorLogger);
app.use(errors()); // celebrate
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const { status = 500, message } = error;
  res.status(status);

  res.json({
    status,
    message,
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server start on PORT:${PORT}`);
});
