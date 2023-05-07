const mongoose = require("mongoose");

const sendingMoney = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },

  balance: {
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

module.exports = mongoose.model("SendingMoney", sendingMoney);
