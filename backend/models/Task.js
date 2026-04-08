const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Task title must be at least 2 characters"],
      maxlength: [120, "Task title cannot exceed 120 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: ""
    },
    createdDate: {
      type: Date,
      default: Date.now
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true
    },
    column: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
