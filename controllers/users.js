const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/badrequest');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/notfound');
const ServerError = require('../errors/servererror');
const UnauthorisedError = require('../errors/unauthorised');
const User = require('../models/user');

// # возвращает информацию о пользователе (email и имя)
// GET /users/me

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      res.send({ data: user });
      // res.send({ email: user.email, name: user.name });
    })
    .catch(() => {
      next(new ServerError('Произошла ошибка'));
    });
};

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { email: req.body.email, name: req.body.name }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        email, password: hashedPassword, name,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else if (err.code === 11000) {
            next(new ConflictError('Такой мейл уже есть в базе'));
          } else {
            next(new ServerError('Произошла ошибка'));
          }
        });
    })
    .catch(() => {
      next(new ServerError('Произошла ошибка'));
    });
};

module.exports.signout = (req, res) => {
  res.clearCookie('jwt');
  res.send({ data: {} });
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password)
          .then((isUserValid) => {
            if (isUserValid) {
              const token = jwt.sign({
                _id: user._id,
              }, process.env.JWT_SECRET || 'mysecret');
              res.cookie('jwt', token, {
                maxAge: 3600000,
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production',
              });
              res.send({ data: user.toJSON() });
            } else {
              next(new UnauthorisedError('Неправильный логин или пароль'));
            }
          });
      } else {
        next(new UnauthorisedError('Неправильный логин или пароль'));
      }
    })
    .catch(next);
};

// module.exports.listUsers = (req, res, next) => {
//   User.find({})
//     .then((users) => res.send({ data: users }))
//     .catch(() => next(new ServerError('Произошла ошибка')));
// };

// module.exports.getUser = (req, res, next) => {
//   User.findOne({ _id: req.user._id })
//     .then((user) => {
//       res.send({ data: user });
//     })
//     .catch(() => {
//       next(new ServerError('Произошла ошибка'));
//     });
// };

// module.exports.getUserbyId = (req, res, next) => {
//   User.findById(req.params.userId)
//     .then((user) => {
//       if (user) {
//         res.send({ data: user });
//       } else {
//         next(new NotFoundError('Пользователь по указанному _id не найден'));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Переданы некорректные данные при запросе пользователя'));
//       } else {
//         next(new ServerError('Произошла ошибка'));
//       }
//     });
// };

// module.exports.createUser = (req, res, next) => {
//   const {
//     name, about, avatar, email, password,
//   } = req.body;

//   bcrypt.hash(password, 10)
//     .then((hashedPassword) => {
//       User.create({
//         name, about, avatar, email, password: hashedPassword,
//       })
//         .then((user) => res.send({ data: user }))
//         .catch((err) => {
//           if (err.name === 'ValidationError') {
//             next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
//           } else if (err.code === 11000) {
//             next(new ConflictError('Такой мейл уже есть в базе'));
//           } else {
//             next(new ServerError('Произошла ошибка'));
//           }
//         });
//     })
//     .catch(() => {
//       next(new ServerError('Произошла ошибка'));
//     });
// };

// module.exports.updateUser = (req, res, next) => {
//   User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, {
//     new: true, // обработчик then получит на вход обновлённую запись
//     runValidators: true, // данные будут валидированы перед изменением
//   })
//     .then((user) => {
//       if (user) {
//         res.send({ data: user });
//       } else {
//         next(new NotFoundError('Пользователь с указанным _id не найден'));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
//       } else {
//         next(new ServerError('Произошла ошибка'));
//       }
//     });
// };

// module.exports.updateAvatar = (req, res, next) => {
//   User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
//     new: true, // обработчик then получит на вход обновлённую запись
//     runValidators: true, // данные будут валидированы перед изменением
//   })
//     .then((user) => {
//       if (user) {
//         res.send({ data: user });
//       } else {
//         next(new NotFoundError('Пользователь с указанным _id не найден'));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
//       } else {
//         next(new ServerError('Произошла ошибка'));
//       }
//     });
// };

// module.exports.login = (req, res, next) => {
//   const {
//     email, password,
//   } = req.body;
//   User.findOne({ email })
//     .select('+password')
//     .then((user) => {
//       if (user) {
//         bcrypt.compare(password, user.password)
//           .then((isUserValid) => {
//             if (isUserValid) {
//               const token = jwt.sign({
//                 _id: user._id,
//               }, 'mysecret');
//               res.cookie('jwt', token, {
//                 maxAge: 3600000,
//                 httpOnly: true,
//                 sameSite: true,
//               });
//               res.send({ data: user.toJSON() });
//             } else {
//               next(new UnauthorisedError('Неправильный логин или пароль'));
//             }
//           });
//       } else {
//         next(new UnauthorisedError('Неправильный логин или пароль'));
//       }
//     })
//     .catch(next);
// };
