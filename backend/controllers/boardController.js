const Board = require("../models/Board");
const Column = require("../models/Column");
const Task = require("../models/Task");

const getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (error) {
    next(error);
  }
};

const getBoardById = async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, userId: req.user._id }).lean();

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    const columns = await Column.find({ board: board._id, userId: req.user._id })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const columnIds = columns.map((column) => column._id);
    const tasks = await Task.find({ column: { $in: columnIds }, userId: req.user._id })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const tasksByColumn = tasks.reduce((acc, task) => {
      const key = String(task.column);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(task);
      return acc;
    }, {});

    const boardWithDetails = {
      ...board,
      columns: columns.map((column) => ({
        ...column,
        tasks: tasksByColumn[String(column._id)] || []
      }))
    };

    res.json(boardWithDetails);
  } catch (error) {
    next(error);
  }
};

const createBoard = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400);
      throw new Error("Board name is required");
    }

    const board = await Board.create({ name: name.trim(), userId: req.user._id });

    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
};

const updateBoard = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400);
      throw new Error("Board name is required");
    }

    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    res.json(board);
  } catch (error) {
    next(error);
  }
};

const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, userId: req.user._id });

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    const columns = await Column.find({ board: board._id, userId: req.user._id });
    const columnIds = columns.map((column) => column._id);

    await Task.deleteMany({ column: { $in: columnIds }, userId: req.user._id });
    await Column.deleteMany({ board: board._id, userId: req.user._id });
    await Board.deleteOne({ _id: board._id, userId: req.user._id });

    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard
};
