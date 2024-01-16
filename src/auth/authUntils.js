"use strict";
const JWT = require("jsonwebtoken");
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accsessToken
    const accsessToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });

    //
    JWT.verify(accsessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("=======> errr", err);
      } else {
        console.log('========> ok',decode)
      }
    });
    return { accsessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = {
  createTokenPair,
};
