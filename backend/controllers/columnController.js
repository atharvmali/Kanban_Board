const Board = require("../models/Board");
const Column = require("../models/Column");
const Task = require("../models/Task");

const getColumnsByBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    const columns = await Column.find({ board: req.params.boardId }).sort({ order: 1, createdAt: 1 });
    res.json(columns);
  } catch (error) {
    next(error);
  }
};

const createColumn = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error("Column title is required");
    }

    const board = await Board.findById(req.params.boardId);

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    const columnCount = await Column.countDocuments({ board: board._id });

    const column = await Column.create({
      title: title.trim(),
      board: board._id,
      order: columnCount
    });

    board.columns.push(column._id);
    await board.save();

    res.status(201).json(column);
  } catch (error) {
    next(error);
  }
};

const updateColumn = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error("Column title is required");
    }

    const column = await Column.findByIdAndUpdate(
      req.params.id,
      { title: title.trim() },
      { new: true, runValidators: true }
    );

    if (!column) {
      res.status(404);
      throw new Error("Column not found");
    }

    res.json(column);
  } catch (error) {
    next(error);
  }
};

const deleteColumn = async (req, res, next) => {
  try {
    const column = await Column.findById(req.params.id);

    if (!column) {
      res.status(404);
      throw new Error("Column not found");
    }

    await Task.deleteMany({ column: column._id });
    await Board.findByIdAndUpdate(column.board, { $pull: { columns: column._id } });
    await Column.findByIdAndDelete(column._id);

    res.json({ message: "Column deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getColumnsByBoard,
  createColumn,
  updateColumn,
  deleteColumn
};
