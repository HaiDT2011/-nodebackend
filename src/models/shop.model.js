"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

var shop = new Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pass: {
      type: String,
      required: true,
    },
  },{
      collection: COLLECTION_NAME,
      timestamps: true
  });
  
  //Export the model
  module.exports = mongoose.model(DOCUMENT_NAME, shop);