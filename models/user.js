const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "User",
    enum: ["User", "Moderator", "Admin"],
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  securityCode: { type: Number, required: true },
  suggestionName: { type: String, required: false },
  accountType: { type: String, default: "IBAN", enum: ["TRC-20", "IBAN"] },
  accountCode: { type: String, required: false },
  task: { type: Array, default: [], required: false },
  approvedTask: { type: Array, default: [], required: false },
  doneTask: { type: Array, default: [], required: false },
  charge: { type: Number, default: 0, required: false },
  frozen: { type: Number, default: 0, required: false },
  taskNumber: { type: Number, default: 1, required: false },
  token: { type: String },
});

module.exports = mongoose.model("User", userSchema);
