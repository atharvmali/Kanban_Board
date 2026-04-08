const express = require("express");
const {
  getTasksByColumn,
  createTask,
  updateTask,
  deleteTask,
  moveTask
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/columns/:columnId/tasks").get(getTasksByColumn).post(createTask);
router.route("/tasks/:id").put(updateTask).delete(deleteTask);
router.route("/tasks/:id/move").patch(moveTask);

module.exports = router;
