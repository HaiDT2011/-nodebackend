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

const {countConnect} = require('./helpers/check.connect')

//init routes

app.use(express.json()) 
app.use('/',require('./routes'))

//handle error


module.exports = app;
