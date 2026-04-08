const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const Board = require("../models/Board");
const Column = require("../models/Column");
const Task = require("../models/Task");

dotenv.config();

const migrateAssignUser = async () => {
  try {
    await connectDB();

    const email = process.env.MIGRATION_USER_EMAIL || "legacy-owner@example.com";
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: "Legacy Owner",
        email,
        password: process.env.MIGRATION_USER_PASSWORD || "password123"
      });
    }

    const boardResult = await Board.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: user._id } }
    );

    const boards = await Board.find({ userId: user._id }).select("_id");
    const boardIds = boards.map((board) => board._id);

    const columnResult = await Column.updateMany(
      { userId: { $exists: false }, board: { $in: boardIds } },
      { $set: { userId: user._id } }
    );

    const columns = await Column.find({ userId: user._id }).select("_id");
    const columnIds = columns.map((column) => column._id);

    const taskResult = await Task.updateMany(
      { userId: { $exists: false }, column: { $in: columnIds } },
      { $set: { userId: user._id } }
    );

    console.log("Migration completed.");
    console.log(`Boards assigned: ${boardResult.modifiedCount}`);
    console.log(`Columns assigned: ${columnResult.modifiedCount}`);
    console.log(`Tasks assigned: ${taskResult.modifiedCount}`);

    process.exit(0);
  } catch (error) {
    console.error(`Migration failed: ${error.message}`);
    process.exit(1);
  }
};

migrateAssignUser();
