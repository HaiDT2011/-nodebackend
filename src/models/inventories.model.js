"use strict";

"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inven_location: {
      type: String,
      default: "unKnow",
    },
    inven_stock: {
      type: String,
      required: true,
    },
    iven_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    iven_reservations: {
      type: Array,
      default: []
      /*
        cartId,
        stock,
        createOn
      */
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
