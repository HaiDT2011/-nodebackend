"use strict";

const { Schema } = require("mongoose");

const getIntoData = (filed = [], object = Object) => {
  let dataObjectConvert = {};

  Object.keys(object).forEach((value) => {
    if (filed.findIndex(indValue => indValue === value?.toString()) > -1) {
      dataObjectConvert = { ...dataObjectConvert, [value]: object.keys(value) };
    }
  });
  return dataObjectConvert;
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const convertToObjectDB = id => {
  return Schema.Types.ObjectId(id)
}

const removeUndefinedObject = obj => {
  Object.keys(object).forEach((value) => {
    if(!obj[value]){
      delete obj[value]
    }
  })
  return obj
}

module.exports = {
  getIntoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  convertToObjectDB
}
