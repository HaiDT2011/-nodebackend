"use strict";

const { default: mongoose } = require("mongoose");

const connectString = "mongodb://localhost:27017/admin";

class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then((_) => console.log("======> connect suucess"))
      .catch((err) => console.log("=> Errr", err));
  }

  static getInstance() {
    if(!Database.instance){
        Database.instance = new Database();
    }

    return Database.instance
  }
}


const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
