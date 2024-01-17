"use strict";
const JWT = require("jsonwebtoken");
const { asyncHander } = require("../helpers/checkError");
const { AuthFailureError, NotFoundError } = require("../core/error.res");
const { findByUserId } = require("../services/keyToken.service");
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accsessToken
    const accsessToken = await JWT.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });

    JWT.verify(accsessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("=======> errr", err);
      } else {
        console.log("========> ok", decode);
      }
    });
    return { accsessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const  authentication = asyncHander(async (req, res, next) => {
  //1 - check userId missing
  //2- get access token
  //3- verityfi token
  //4- check userID
  //5- check keyStore with this userID

  const userId = req.headers["x-client-id"];
  if (!userId) throw new AuthFailureError("Invalid Request");

  const keyStore = await findByUserId({ userId });
  if (!keyStore) throw new NotFoundError("Not Found Error");

  const accessToken = req.headers["athorization"];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore?.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid User");
    }

    req.keyStore = keyStore;
  } catch (error) {}
});

module.exports = {
  createTokenPair,
  authentication
};
