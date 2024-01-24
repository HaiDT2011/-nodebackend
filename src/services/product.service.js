"use strict";

const { BadRequestError } = require("../core/error.res");
const { product, clothing, electronics } = require("../models/product.model");
const { insertInventories } = require("../models/repositories/inventory.repo");
const {
  findAllDraftsForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProduct,
  findOneProduct,
  findByIdUpdateProduct,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject } = require("../utils");

// define base create product

class ProductFactory {
  static productRegistry = {};

  static registerProductTypes(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, product_id, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);
    return new productClass(payload).updateProduct(product_id);
  }

  // put

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async searchProductByUser({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProduct({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findOneProduct({ product_id }) {
    return await findOneProduct({ product_id, unSelect: ["__v"] });
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
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.prodcut_quantity = prodcut_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const productNew = await product.create({
      ...this,
      _id: product_id,
    });

    if (!productNew) throw BadRequestError("create product error");

    const inventory = await createInventories({
      inven_productId: productNew._id,
      inven_stock: this.prodcut_quantity,
      iven_shopId: this.product_shop,
    });

    if (!inventory) throw BadRequestError("create inventory error");
    
    return product;
  }

  async updateProduct(product_id, payload) {
    return findByIdUpdateProduct({
      product_id,
      payload,
      model: product,
      isNew: true,
    });
  }
}

//define sub-class for diferent product types Closing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw BadRequestError("create clothing error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw BadRequestError("create product error");

    return newProduct;
  }

  async updateProduct(product_id) {
    // remove atribute has null and underfined
    // check update o cho nao
    const objectPrams = removeUndefinedObject(this);
    if (objectPrams.product_attributes) {
      findByIdUpdateProduct({
        product_id,
        objectPrams,
        model: clothing,
        isNew: true,
      });
    }
    const updateProduct = await super.updateProduct();
    if (!updateProduct) throw BadRequestError("update product error");
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronics) throw BadRequestError("create clothing error");

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw BadRequestError("create product error");

    return newProduct;
  }
}

ProductFactory.registerProductTypes("Electronics", Electronics);
ProductFactory.registerProductTypes("Clothing", Clothing);

module.exports = {
  ProductFactory,
};
