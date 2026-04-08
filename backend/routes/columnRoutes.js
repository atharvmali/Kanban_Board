const express = require("express");
const {
  getColumnsByBoard,
  createColumn,
  updateColumn,
  deleteColumn
} = require("../controllers/columnController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/boards/:boardId/columns").get(getColumnsByBoard).post(createColumn);
router.route("/columns/:id").put(updateColumn).delete(deleteColumn);

module.exports = router;
