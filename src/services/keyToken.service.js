"use strict";

const { filter } = require("compression");
const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const publicKeyString = publicKey.toString();
      // const token = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKey,
      //   privateKey: privateKey
      // })

      // return token ? token.publicKey : ''
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken: refreshToken,
        },
        option = { upsert: true, new: true };
      const token = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        option
      );

      return token ? token.publicKey : "";
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async ({ userId }) => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId) });
  };

  static removeKeyById = async ({ id }) => {
    return await keytokenModel.deleteOne(id)
  }

  static findByRefreshTokenUser = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken }).lean()
  }
}

module.exports = KeyTokenService;
