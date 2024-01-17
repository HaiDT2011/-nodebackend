"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");

const route = express.Router();

// //check apiKey
route.use(apiKey);
// //check permissions
// route.use(permission("0000"));
//
route.use("/v1/api", require("./access/index"));

module.exports = route;
