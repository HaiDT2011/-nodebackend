const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");


const app = express();


// init middlewares

// app.use(express.json());
app.use(morgan('common'))
app.use(helmet())
app.use(compression())

//init database

require('./dbs/init.mongodb')

const { countConnect } = require('./helpers/check.connect')

//init routes

app.use(express.json())
app.use('/', require('./routes'))

app.use((req, res, next) => {
  const error = new Error('Not Found')
  next(error)
})

app.use((err, req, res, next) => {
  const statusCode = err.status || 500
  return res.status(statusCode).json({
    stauts: 'error',
    code: statusCode,
    message: err.message || 'Internal Server Error'
  })
})

//handle error


module.exports = app;
