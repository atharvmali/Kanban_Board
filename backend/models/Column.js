const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Column title is required"],
      trim: true,
      minlength: [2, "Column title must be at least 2 characters"],
      maxlength: [50, "Column title cannot exceed 50 characters"]
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Column", columnSchema);
