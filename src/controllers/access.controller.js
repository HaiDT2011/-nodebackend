'use strict'

const AccessService = require("../services/access.service")

class AccessController {
  signUp = async (req, res, next) => {
    console.log('===========>req',res)
    try {
      return res.status(200).json(await AccessService.signUp(req?.body))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AccessController()