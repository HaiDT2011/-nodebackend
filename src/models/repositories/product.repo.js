const { product } = require("../product.model")


const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await product.find(query).
    populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const shop =  product.findOne({
    product_shop,
    _id: product_id
  }).lean()

  if(!shop) return null

  shop.isDraft = false
  shop.isPublished = true
  const {modifiedCount} = await shop.updateOne(shop)
  return modifiedCount
}

module.exports = {
  findAllDraftsForShop,
  publishProductByShop
}