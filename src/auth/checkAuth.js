"use strict";

const { findByID } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    //check objectket

    const objKey = await findByID(key);

    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log("========>", error);
  }
};

const permission = (permissions) => {
  return (req, res, next) => {
    if (!req.objKey.permissions || req.objKey.permissions.includes(permissions)) {
      return res.status(403).json({
        message: "permission denied",
      });
    }

  };
};

module.exports = { apiKey, permission };
