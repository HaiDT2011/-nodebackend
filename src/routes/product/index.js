"use strict";

const express = require("express");
const { authentication } = require("../../auth/authUntils");
const productController = require("../../controllers/product.controller");
const { asyncHander } = require("../../helpers/checkError");

const route = express.Router();
//create product
route.use(authentication);

route.post("/product", asyncHander(productController.createProduct));
route.get("/product/draf/all", asyncHander(productController.getAllDraftsForShop));
route.get("/product/publish/all", asyncHander(productController.getAllDraftsForShop));

module.exports = route;