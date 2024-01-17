"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, virifityJWT } = require("../auth/authUntils");
const { BadRequestError, AuthFailureError, FORBIDDENEROR } = require("../core/error.res");
const { findByEmail } = require("./shop.service");
const { constants } = require("buffer");

const RoleShop = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessSerice {

  static handleRefreshToken = async ({refreshToken}) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUser(refreshToken)

    if (foundToken) {
      // decode
      const { userId, email } = await virifityJWT(refreshToken, foundToken.privateKey)
      //xóa
      await KeyTokenService.removeKeyById({ id: userId })

      throw new FORBIDDENEROR('Something ')
    }

    const holderToken = await KeyTokenService.findByRefreshToken( refreshToken )

    if (!holderToken) throw new AuthFailureError('Shop not registeted')

    //verifity token

    const { userId, email } = await virifityJWT(refreshToken, holderToken)

    //checl userID 

    const foundShop = await findByEmail({ email })

    if (!foundShop) throw new AuthFailureError('Shop not registeted')

    // create token 
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      holderToken.publicKey,
      holderToken.privateKey
    );
    await holderToken.updated({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })
    return {
      user: { userId, email },
      tokens
    }
  }

  static logout = async (keyStore) => {
    return KeyTokenService.removeKeyById({ id: keyStore._id })
  }

  static login = async ({ email, password, refreshToken }) => {
    //check email in dbs

    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Not Register");
    }
    //match password
    const matchPass = await bcrypt.compare(password, foundShop.password);

    if (!matchPass) {
      throw new AuthFailureError("Authent Error");
    }
    //create AT, RefToken

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    // generate tokens
    // get login
    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      userId: foundShop._id,
      publicKey,
      privateKey,
    });

    return {
      shop: foundShop,
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    //step1: check mail exist
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop 1", 403);
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
      // create token pair
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken
      });

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);

      if (!keyStore) {
        throw new BadRequestError("Error: Shop 2", 403);
      }

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
