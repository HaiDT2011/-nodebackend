"use strict";

const { CREATE, SuccessResponse } = require("../core/success.res");
const AccessService = require("../services/access.service");

class AccessController {

  refreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Refresh Token OK',
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res)

  };

  login = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout OK',
      metadata: await AccessService.login(req.body)
    }).send(res)

  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      // message: 'Login OK',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)

  };


  signUp = async (req, res, next) => {
    new CREATE({
      message: 'Registed OK',
      metadata: await AccessService.signUp(req.body)
    }).send(res)

    // return res.status(201).json(await AccessService.signUp(req?.body));
  };
}

module.exports = new AccessController();
