'use strict'

const { BadRequestError, AuthFailureError } = require("../core/error.res")
const discountModel = require("../models/discount.model")
const { convertToObjectDB } = require("../utils")

/*
Discount Service 

1- genrator discount code [Shop/Admin]
2- Get discount amount [User]
3- Get all discount codes [User/Shop]
4- Verifi discount code [user]
5- Delete discoutn code [Admin/Shop]
6- Cancel discount code [user]
*/

class DiscountService {
  static async createDiscountCode(body) {
    const {
      code, start_date, end_date, is_active,
      shopId, min_order, product_ids, applies_to, name, description,
      type, value, max_value, max_uses, uses_count, max_uses_per_user
    } = payload

    if (new Date() < new Date(end_date) || new Date() > new Date(start_date)) {
      throw new BadRequestError('Date invalid')
    }

    //create index for discount code

    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shop_id: convertToObjectDB(shopId)
    }).lean()

    if (!foundDiscount && foundDiscount.discount_is_active === true) throw new AuthFailureError("discount already exists");

    const discountCreated = await discountModel.create({
      discount_name: name,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_use: max_uses,
      discount_user_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_oder_value: min_order,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_des: description,
      discount_product_ids: product_ids,
      discount_type: type,
      discount_max_value: max_value
    })

    if(!discountCreated) throw new BadRequestError("Error create ");
  }
}