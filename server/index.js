/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// const { createClient } = require('redis');
const { v1 } = require('config');
const apiV1 = require('./api/v1');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Mongoose
mongoose.connect(v1.STORAGE.MONGO.uri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Fela');
  next();
});

// Redis, REmote DIctionary Server
/**
 * Access via res.locals.cache
 */
// const redis = createClient(v1.STORAGE.REDIS.port, v1.STORAGE.REDIS.host);
// redis.on('error', console.error.bind(console, 'connection error:'));
// app.locals.cache = redis;
/* eslint-disable no-extend-native, no-restricted-syntax, guard-for-in, prefer-rest-params, no-undef */
String.prototype.format = function form() {
  let formatted = this;
  for (arg in arguments) {
    formatted = formatted.replace(`{${arg}}`, arguments[arg]);
  }
  return formatted;
};

apiV1(app);

module.exports = app;
