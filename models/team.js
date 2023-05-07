const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  group: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Team", teamSchema);
