const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

require('express-async-errors');

const blogsRouter = require('./controllers/blogs.js');

const config = require('./utils/config.js');
const logger = require('./utils/logger.js');
const middleware = require('./utils/middleware.js');

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
