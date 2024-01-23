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
      metadata: await ProductFactory.findAllDraftsForShop({ product_shop: req.user.userId })
    }).send(res)
  }

  putPublish = async (req, res, next) => {
    new SuccessResponse({
      message: 'get data OK',
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.param.id
      })
    }).send(res)
  }

  putUnPublish = async (req, res, next) => {
    new SuccessResponse({
      message: 'get data OK',
      metadata: await ProductFactory.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.param.id
      })
    }).send(res)
  }

  searchProductByUser = async () => {
    new SuccessResponse({
      message: 'get data OK',
      metadata: await ProductFactory.searchProductByUser(req.param)
    }).send(res)
  }

  updateProduct = async () => {
    new SuccessResponse({
      message: 'get data OK',
      metadata: await ProductFactory.updateProduct(req.body.product_type, req.param.id,  {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }
}

module.exports = new ProductController();
