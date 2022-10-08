const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser, signout } = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(1),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  createUser,
);

router.get('/signout', signout);

module.exports = router;
