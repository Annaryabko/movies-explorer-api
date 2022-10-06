const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  listMovies, createMovie, deleteMovie,
} = require('../controllers/movie');

// возвращает все сохранённые текущим  пользователем фильмы GET /movies
router.get('/', listMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().min(2).max(30).required(),
      director: Joi.string().min(2).max(30).required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().min(2).max(30).required(),
      image: Joi.string().pattern(/https?:\/\/(www\.)*[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*#?/i).required(),
      trailerLink: Joi.string().pattern(/https?:\/\/(www\.)*[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*#?/i).required(),
      thumbnail: Joi.string().pattern(/https?:\/\/(www\.)*[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*#?/i).required(),
      movieId: Joi.string().required(), // ???
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

// удаляет сохранённый фильм по id DELETE /movies/_id

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);



// router.post(
//   '/',
//   celebrate({
//     body: Joi.object().keys({
//       name: Joi.string().min(2).max(30).required(),
//       link: Joi.string().pattern(/https?:\/\/(www\.)*[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*#?/i).required(),
//     }),
//   }),
//   createCard,
// );

// router.delete('/:cardId', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().hex().length(24).required(),
//   }),
// }), deleteCard);

// router.put('/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().hex().length(24).required(),
//   }),
// }), likeCard);

// router.delete('/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().hex().length(24).required(),
//   }),
// }), dislikeCard);

module.exports = router;
