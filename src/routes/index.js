"use strict";

const express = require('express')

const route = express.Router();

// 
route.use('/v1/api', require('./access/index'))

module.exports = route

