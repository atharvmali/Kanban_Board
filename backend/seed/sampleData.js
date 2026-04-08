const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const Board = require("../models/Board");
const Column = require("../models/Column");
const Task = require("../models/Task");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Task.deleteMany();
    await Column.deleteMany();
    await Board.deleteMany();
    await User.deleteMany();

    const user = await User.create({
      name: "Demo User",
      email: "demo@example.com",
      password: "password123"
    });

    const board = await Board.create({ name: "Personal Project Roadmap", userId: user._id });

    const todo = await Column.create({ title: "Todo", board: board._id, userId: user._id, order: 0 });
    const inProgress = await Column.create({
      title: "In Progress",
      board: board._id,
      userId: user._id,
      order: 1
    });
    const done = await Column.create({ title: "Done", board: board._id, userId: user._id, order: 2 });

    board.columns = [todo._id, inProgress._id, done._id];
    await board.save();

    await Task.insertMany([
      {
        title: "Set up backend structure",
        description: "Create Express server, folders, and MongoDB connection.",
        board: board._id,
        column: todo._id,
        userId: user._id,
        order: 0
      },
      {
        title: "Design responsive Kanban UI",
        description: "Build columns and cards using Flexbox/Grid for all screen sizes.",
        board: board._id,
        column: inProgress._id,
        userId: user._id,
        order: 0
      },
      {
        title: "Write setup guide",
        description: "Document installation, environment variables, and run steps.",
        board: board._id,
        column: done._id,
        userId: user._id,
        order: 0
      }
    ]);

    console.log("Sample data seeded successfully.");
    console.log("Demo login -> email: demo@example.com | password: password123");
    process.exit(0);
  } catch (error) {
    console.error(`Failed to seed data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
