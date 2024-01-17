"use strict";

const apikeyModel = require("../models/apikey.model");
const crypto = require('crypto')

const findByID = async (key) => {

    // await apikeyModel.create({
    //     key : crypto.randomBytes(64).toString('hex'),
    //     permissions: ['0000']
    // })  
    const objKey = await apikeyModel.findOne({key, status:true}).lean();

    return objKey
};


module.exports = {
    findByID
}
