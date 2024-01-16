"use strict";

const express = require('express');
const { asyncHander } = require('../../auth/checkError');
const accessController = require('../../controllers/access.controller');

const route = express.Router();


// signUp

route.post('/shop/signup', asyncHander(accessController.signUp))

module.exports = route