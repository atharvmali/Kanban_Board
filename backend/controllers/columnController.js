const Board = require("../models/Board");
const Column = require("../models/Column");
const Task = require("../models/Task");

const getColumnsByBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.boardId, userId: req.user._id });

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    const columns = await Column.find({ board: req.params.boardId, userId: req.user._id }).sort({
      order: 1,
      createdAt: 1
    });
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

    const board = await Board.findOne({ _id: req.params.boardId, userId: req.user._id });

    if (!board) {
      res.status(404);
      throw new Error("Board not found");
    }

    const columnCount = await Column.countDocuments({ board: board._id, userId: req.user._id });

    const column = await Column.create({
      title: title.trim(),
      board: board._id,
      userId: req.user._id,
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

    const column = await Column.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
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
    const column = await Column.findOne({ _id: req.params.id, userId: req.user._id });

    if (!column) {
      res.status(404);
      throw new Error("Column not found");
    }

    await Task.deleteMany({ column: column._id, userId: req.user._id });
    await Board.findOneAndUpdate(
      { _id: column.board, userId: req.user._id },
      { $pull: { columns: column._id } }
    );
    await Column.deleteOne({ _id: column._id, userId: req.user._id });

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
