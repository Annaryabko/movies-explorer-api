const Movie = require('../models/movie');
const ServerError = require('../errors/servererror');
const BadRequestError = require('../errors/badrequest');
const NotFoundError = require('../errors/notfound');
const ForbiddenError = require('../errors/forbidden');

module.exports.listMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(() => next(new ServerError('Произошла ошибка')));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм с указанным _id не найдена'));
      } else if (String(movie.owner) === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => {
            res.send({ data: movie });
          })
          .catch(() => {
            next(new ServerError('Произошла ошибка'));
          });
      } else {
        next(new ForbiddenError('Фильм не Ваш и ее не удалить Вам'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении фильма'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

// module.exports.createCard = (req, res, next) => {
//   const { name, link } = req.body;
//   Card.create({ name, link, owner: req.user._id })
//     .then((card) => res.send({ data: card }))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError('Переданы некорректные данные при создании карточки'));
//       } else {
//         next(new ServerError('Произошла ошибка'));
//       }
//     });
// };

// module.exports.deleteCard = (req, res, next) => {
//   Card.findById(req.params.cardId)
//     .then((card) => {
//       if (!card) {
//         next(new NotFoundError('Карточка с указанным _id не найдена'));
//       } else if (String(card.owner) === req.user._id) {
//         Card.findByIdAndRemove(req.params.cardId)
//           .then(() => {
//             res.send({ data: card });
//           })
//           .catch(() => {
//             next(new ServerError('Произошла ошибка'));
//           });
//       } else {
//         next(new ForbiddenError('Карточка не Ваша и ее не удалить Вам'));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
//       } else {
//         next(new ServerError('Произошла ошибка'));
//       }
//     });
// };

// module.exports.likeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
//     { new: true },
//   )

//     .then((card) => {
//       if (card) {
//         res.send({ data: card });
//       } else {
//         next(new NotFoundError('Передан несуществующий _id карточки'));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
//       } else {
//         next(new ServerError('Произошла ошибка'));
//       }
//     });
// };

// module.exports.dislikeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } }, // убрать _id из массива
//     { new: true },
//   )
//     .then((card) => {
//       if (card) {
//         res.send({ data: card });
//       } else {
//         next(new NotFoundError('Передан несуществующий _id карточки'));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
//       } else {
//         next(new ServerError('Произошла ошибка'));
//       }
//     });
// };
