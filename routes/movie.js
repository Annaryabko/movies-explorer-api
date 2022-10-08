const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const {
  listMovies, createMovie, deleteMovie,
} = require('../controllers/movie');

router.get('/movies', listMovies);

router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().min(2).max(30).required(),
      director: Joi.string().min(2).max(30).required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().min(2).max(30).required(),
      image: Joi.string().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.error('any.invalid');
      }).required(),
      trailerLink: Joi.string().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.error('any.invalid');
      }).required(),
      thumbnail: Joi.string().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.error('any.invalid');
      }).required(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

// удаляет сохранённый фильм по id DELETE /movies/_id

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
