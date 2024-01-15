"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const token = await keytokenModel.create({
        user: userId,
        publicKey: publicKeyString
      })

      return token ? publicKeyString : ''
    } catch (error) {
      return error;
    }
  };
}

module.exports = new KeyTokenService();
