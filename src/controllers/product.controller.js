"use strict";

const { CREATE, SuccessResponse } = require("../core/success.res");
const { ProductFactory } = require("../services/product.service");

class ProductController {

  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new product success!',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)

  };

  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'get data OK',
      metadata: await ProductFactory.findAllDraftsForShop({product_shop:req.user.userId})
    }).send(res)
  }

  putPublish = async (req, res, next) => {
    new SuccessResponse({
      message: 'get data OK',
      metadata: await ProductFactory.publishProductByShop({product_shop:req.user.userId})
    }).send(res)
  }

}

module.exports = new ProductController();
