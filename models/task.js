const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  taskPrice: {
    type: Number,
    required: true,
  },

  taskComission: {
    type: Number,
    required: true,
  },

  taskPhoto: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
