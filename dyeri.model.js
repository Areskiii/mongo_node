const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Dyeri = new Schema({
  dyeri_description: {
    type: String
  },
  dyeri_name: {
    type: String
  },
  dyeri_type: {
    type: String
  },
  dyeri_price: {
    type: Number
  },
  dyeri_image: {
    type: String
  },
  dyeri_date: {
    type: String
  },
  dyeri_chefId: {
    type: String
  },
  dyeri_chefName: {
    type: String
  },
  dyeri_cheftel: {
    type: Number
  },
  dyeri_chefname: {
    type: String
  }
});

module.exports = mongoose.model("Dyeri", Dyeri);
