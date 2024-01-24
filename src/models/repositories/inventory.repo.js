"use strict";

const inventoriesModel = require("../inventories.model");

const insertInventories = async ({
  inven_productId,
  inven_location = "unKnow",
  inven_stock,
  iven_shopId
}) => {
  const inventoryCreated = await inventoriesModel.create({
    inven_productId,
    inven_location,
    inven_stock,
    iven_shopId,
  });

  return inventoryCreated;
};

module.exports = {
  insertInventories
}
