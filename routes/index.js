const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movie');
const authRouter = require('./auth');
const { auth } = require('../middlewares/auth');

router.use(authRouter);
router.use(auth);
router.use(userRouter);
router.use(movieRouter);

module.exports = router;
