const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Board name is required"],
      trim: true,
      minlength: [2, "Board name must be at least 2 characters"],
      maxlength: [60, "Board name cannot exceed 60 characters"]
    },
    columns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Column"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);
