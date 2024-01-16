"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUntils");
const { BadRequestError } = require("../core/error.res");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessSerice {

  static login = async ({email, password, refreshToken }) => {
    //check email in dbs
    //match password
    //create AT, RefToken
    // generate tokens
    // get login

    const foundShop = await findByEmail({email})
    if(!foundShop){
      throw new BadRequestError('Shop not register')
    }

    const matchPass = bcrypt.compare(password, foundShop.password)

    if(!matchPass){

    }
  }

  static signUp = async ({ name, email, password }) => {
    // try {
      //step1: check mail exist
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
          throw new BadRequestError("Error: Shop 1",403)
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        //create privateKey, publicKey
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        // console.log({ privateKey, publicKey }); // save collection KeyStore

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        // const publicKeyObject = crypto.createPublicKey(publicKeyString);

        if (!keyStore) {
          throw new BadRequestError("Error: Shop 2",403)
        }
        // create token pair
        const tokens = await createTokenPair(
          {
            userId: newShop._id,
            email,
          },
          publicKey,
          privateKey
        );

        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens: tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    // } catch (error) {
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessSerice;
