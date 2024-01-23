const { getSelectData, getUnSelectData } = require("../../utils");
const { product } = require("../product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const shop = product
    .findOne({
      product_shop,
      _id: product_id,
    })
    .lean();

  if (!shop) return null;

  shop.isDraft = false;
  shop.isPublished = true;
  const { modifiedCount } = await shop.updateOne(shop);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const shop = product
    .findOne({
      product_shop,
      _id: product_id,
    })
    .lean();

  if (!shop || shop?.isPublished === false) return null;

  shop.isDraft = true;
  shop.isPublished = false;
  const { modifiedCount } = await shop.updateOne(shop);
  return modifiedCount;
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product.find({
    isPublished: true,
    $text: { $search: regexSearch }
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } }).lean()

  return results
};

const findAllProduct = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const productAll = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

  return productAll
}

const findOneProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(getUnSelectData(unSelect))
}

const findByIdUpdateProduct = async ({ product_id, payload, model, isNew = true }) => {
  return await model.findByIdAndUpdate(product_id, payload, {
    new: isNew
  })
} 

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProduct,
  findOneProduct,
  findByIdUpdateProduct
};
