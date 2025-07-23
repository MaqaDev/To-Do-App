const express = require("express");
const path = require("path");
const controllerPath = path.join(
  __dirname,
  "..",
  "controllers",
  "taskController"
);
const {
  getAllTask,
  addTask,
  updateTask,
  deleteTask,
  deleteAllTask,
} = require(controllerPath);
const router = express.Router();
router.get("/tasks", getAllTask);
router.post("/tasks", addTask);
router.delete("/tasks", deleteAllTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

module.exports = router;
