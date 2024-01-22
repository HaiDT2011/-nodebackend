'use strict'

const { BadRequestError } = require("../core/error.res")
const { product, clothing, electronics } = require("../models/product.model")
const { findAllDraftsForShop, publishProductByShop } = require("../models/repositories/product.repo")

// define base create product



class ProductFactory {

  static productRegistry = {}

  static registerProductTypes(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (productClass) new BadRequestError(`Invalid Product Types ${type}`)
    return new productClass(payload).createProduct()
  }

  // put

  static async publishProductByShop({product_shop, product_id}) {
    return await publishProductByShop({product_shop,product_id})
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftsForShop({ query, limit, skip })
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    prodcut_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.prodcut_quantity = prodcut_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  async createProduct(product_id) {
    return await product.create({
      ...this,
      _id: product_id
    })
  }
}

//define sub-class for diferent product types Closing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) throw BadRequestError('create clothing error')

    const newProduct = await super.createProduct()
    if (!newProduct) throw BadRequestError('create product error')

    return newProduct
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronics) throw BadRequestError('create clothing error')

    const newProduct = await super.createProduct(newElectronics._id)
    if (!newProduct) throw BadRequestError('create product error')

    return newProduct
  }
}

ProductFactory.registerProductTypes('Electronics', Electronics)
ProductFactory.registerProductTypes('Clothing', Clothing)


module.exports = {
  ProductFactory
}