const mongoose = require("mongoose");

const photoSchema = mongoose.Schema({
  photoUrls: {
    type: Array,
    required: true,
  },
  links: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Photo", photoSchema);
