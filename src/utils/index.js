"use strict";

const getIntoData = (filed = [], object = Object) => {
  let dataObjectConvert = {};
  console.log('======>value',Object.keys(object))

  Object.keys(object).forEach((value) => {
    if (filed.findIndex(indValue => indValue === value?.toString()) > -1) {
      dataObjectConvert = { ...dataObjectConvert, [value]: object.keys(value) };
    }
  });
  return dataObjectConvert;
};

module.exports = {
    getIntoData
}
