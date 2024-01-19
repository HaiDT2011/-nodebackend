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

const authentication = asyncHander(async (req, res, next) => {

  const userId = req.headers["x-client-id"];
  if (!userId) throw new AuthFailureError("Invalid Request");

  const keyStore = await findByUserId({ userId });
  if (!keyStore) throw new NotFoundError("Not Found Error");

  if (req.headers["refrestoken"]) {
    try {
      const decodeUser = JWT.verify(req.headers["refrestoken"]               , keyStore?.privateKey);
      if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid User");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = req.headers["refrestoken"];
      return next();
    } catch (error) {
      console.log("==========>NotFoundError", error);
    }
  }
});

const virifityJWT = async (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  virifityJWT,
};
