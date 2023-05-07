const mongoose = require("mongoose");

const withdrawMoney = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },

  totalValue: {
    type: Number,
    required: true,
  },

  status: {
    type: Boolean,
    default: false,
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WithdrawMoney", withdrawMoney);
