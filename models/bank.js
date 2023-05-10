const mongoose = require("mongoose");

const bankSchema = mongoose.Schema({
  iban: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  nameSurname: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Banks", bankSchema);
