require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error');
const NotFoundError = require('./errors/notfound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');

const app = express();

mongoose.connect(process.env.DB || 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser());

app.use(requestLogger); // подключаем логгер запросов

app.use(routes);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
