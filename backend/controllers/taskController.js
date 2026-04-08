const Column = require("../models/Column");
const Task = require("../models/Task");

const getTasksByColumn = async (req, res, next) => {
  try {
    const column = await Column.findOne({ _id: req.params.columnId, userId: req.user._id });

    if (!column) {
      res.status(404);
      throw new Error("Column not found");
    }

    const tasks = await Task.find({ column: req.params.columnId, userId: req.user._id }).sort({
      order: 1,
      createdAt: 1
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error("Task title is required");
    }

    const column = await Column.findOne({ _id: req.params.columnId, userId: req.user._id });

    if (!column) {
      res.status(404);
      throw new Error("Column not found");
    }

    const taskCount = await Task.countDocuments({ column: column._id, userId: req.user._id });

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      board: column.board,
      column: column._id,
      userId: req.user._id,
      order: taskCount
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const updatePayload = {};

    if (typeof title === "string") {
      if (!title.trim()) {
        res.status(400);
        throw new Error("Task title cannot be empty");
      }
      updatePayload.title = title.trim();
    }

    if (typeof description === "string") {
      updatePayload.description = description.trim();
    }

    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, updatePayload, {
      new: true,
      runValidators: true
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    await Task.deleteOne({ _id: task._id, userId: req.user._id });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const moveTask = async (req, res, next) => {
  try {
    const { targetColumnId } = req.body;

    if (!targetColumnId) {
      res.status(400);
      throw new Error("targetColumnId is required");
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const targetColumn = await Column.findOne({ _id: targetColumnId, userId: req.user._id });
    if (!targetColumn) {
      res.status(404);
      throw new Error("Target column not found");
    }

    const targetCount = await Task.countDocuments({ column: targetColumn._id, userId: req.user._id });

    task.column = targetColumn._id;
    task.board = targetColumn.board;
    task.userId = req.user._id;
    task.order = targetCount;

    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasksByColumn,
  createTask,
  updateTask,
  deleteTask,
  moveTask
};
