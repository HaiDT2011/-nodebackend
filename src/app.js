const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");


const app = express();


// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

//init database

require('./dbs/init.mongodb')

const {countConnect} = require('./helpers/check.connect')

//init routes

app.get("/", (req, res, next) => {
  const strCompress = 'TM an com'

  return res.status(200).json({
    message: "WC!",
    metadata: strCompress.repeat(10000000)
  });
});

//handle error

module.exports = app;
