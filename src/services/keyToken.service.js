"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey,privateKey }) => {
    try {
      // const publicKeyString = publicKey.toString();
      const token = await keytokenModel.create({
        user: userId,
        publicKey: publicKey,
        privateKey: privateKey
      })

      return token ? token.publicKey : ''
    } catch (error) {
      return error;
    }
  };
}

module.exports =  KeyTokenService;
