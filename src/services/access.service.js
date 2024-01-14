"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUntils");
const { userInfo } = require("os");

const RoleShop = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessSerice {
  static signUp = async ({ name, email, pass }) => {
    try {
      //step1: check mail exist
      const holderShop = await shopModel
        .findOne({
          email,
        })
        .lean();

      if (!holderShop) {
        return {
          code: "xxx",
          message: "Shop already register",
        };
      }

      const passwordHash = await bcrypt.hash(pass, 10);
      const newShop = await shopModel.create({
        name,
        email,
        pass: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        //create privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });
        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        console.log({ privateKey, publicKey });  // save collection KeyStore

        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "error",
          };
        }
        // create tken pair
        const tokens = await createTokenPair(
          {
            userId: newShop._id,
            email,
          },
          publicKey,
          privateKey
        );

        console.log("========>tokens", tokens);

        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}
