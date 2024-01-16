"use strict";

const { CREATE } = require("../core/success.res");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    return new CREATE({
      message: 'Registed OK',
      metadata: await AccessService.signUp(req.body)
    }).send(res)

    // return res.status(201).json(await AccessService.signUp(req?.body));
  };
}

module.exports = new AccessController();
