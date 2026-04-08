const express = require("express");
const {
  getColumnsByBoard,
  createColumn,
  updateColumn,
  deleteColumn
} = require("../controllers/columnController");

const router = express.Router();

router.route("/boards/:boardId/columns").get(getColumnsByBoard).post(createColumn);
router.route("/columns/:id").put(updateColumn).delete(deleteColumn);

module.exports = router;
