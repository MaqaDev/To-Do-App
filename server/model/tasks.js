const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  taskId: {
    type: Number,
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  Completed: {
    type: Boolean,
    default: false,
  },
});

const taskModel = mongoose.model("task", taskSchema);
module.exports = taskModel;
