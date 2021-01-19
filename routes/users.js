const usersRouter = require('express').Router();

const { getMyself } = require('../controllers/users');

usersRouter.get('/me', getMyself);

module.exports = usersRouter;
