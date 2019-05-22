const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Chef = new Schema({
  chef_fullName: {
    type: String
  },
  chef_userName: {
    type: String
  },
  chef_mdp: {
    type: String
  },
  chef_adresse: {
    type: String
  },
  chef_tel: {
    type: String
  },
  chef_email: {
    type: String
  },
  chef_image: {
    type: String
  }
});

module.exports = mongoose.model("Chef", Chef);
