const mongoose = require("mongoose");

const withdrawMoney = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },

  userName: {
    type: String,
    required: true,
  },
  totalValue: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
    enum: ["Resolve", "Pending", "Reject"],
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WithdrawMoney", withdrawMoney);
