"use strict";

const express = require("express");
const { asyncHander } = require("../../helpers/checkError");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUntils");

const route = express.Router();
// login
route.post("/shop/login", asyncHander(accessController.login));

// signUp

route.post("/shop/signup", asyncHander(accessController.signUp));

//authentication//

route.use(authentication);

//logout
route.post("/shop/logout", asyncHander(accessController.logout));

//refreshToken
route.post("/shop/refreshToken", asyncHander(accessController.refreshToken));

module.exports = route;
