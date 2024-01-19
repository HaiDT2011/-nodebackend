"use strict";

const express = require("express");
const { authentication } = require("../../auth/authUntils");
const productController = require("../../controllers/product.controller");
const { asyncHander } = require("../../helpers/checkError");

const route = express.Router();
//create product
route.use(authentication);

route.post("/product", asyncHander(productController.createProduct));

module.exports = route;