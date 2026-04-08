const Board = require("../models/Board");
const Column = require("../models/Column");
const Task = require("../models/Task");

const getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });
    res.json(boards);
  } catch (error) {
    next(error);
  }
};

const getBoardById = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id).lean();

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    const columns = await Column.find({ board: board._id }).sort({ order: 1, createdAt: 1 }).lean();

    const columnIds = columns.map((column) => column._id);
    const tasks = await Task.find({ column: { $in: columnIds } }).sort({ order: 1, createdAt: 1 }).lean();

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

    const board = await Board.create({ name: name.trim() });

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

    const board = await Board.findByIdAndUpdate(
      req.params.id,
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
    const board = await Board.findById(req.params.id);

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    const columns = await Column.find({ board: board._id });
    const columnIds = columns.map((column) => column._id);

    await Task.deleteMany({ column: { $in: columnIds } });
    await Column.deleteMany({ board: board._id });
    await Board.findByIdAndDelete(board._id);

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
