"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
const slugify = require("slugify")

// Declare the Schema of the Mongo model
const productSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_thumb: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
  },
  product_slug: {
    type: String,
  },
  product_price: {
    type: Number,
    required: true,
  },
  prodcut_quantity: {
    type: Number,
    required: true,
  },
  product_type: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Furniture']
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
  product_attributes: {
    type: Schema.Types.Mixed,
    required: true,
  },
  //more
  product_ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be above 5.0'],
    set: (val) => Math.round(val * 10) / 10,
    required: true,
  },
  product_variations: {
    type: Array,
    default: []
  },
  isDraft: {
    type: Boolean,
    default: true,
    index: true,
    select: false
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true,
    select: false
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});


// define the product type = clothing

const clothingSchema = new Schema({
  brand: { type: String, require: true },
  size: String,
  metarial: String
}, {
  timestamps: true,
  collection: "clothing"
})

//Document middleware : run before .save() .create()

productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_description, { lower: true })
  next()
})

// define the product type = electronics

const electronicsSchema = new Schema({
  manufactuere: { type: String, require: true },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
  model: String,
  color: String
}, {
  timestamps: true,
  collection: "electronic"
})

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothings', clothingSchema),
  electronics: model('Electronics', electronicsSchema),
}