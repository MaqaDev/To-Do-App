const express = require("express");
const path = require("path");
const controllerPath = path.join(
  __dirname,
  "..",
  "controllers",
  "taskController"
);
const { getAllTask, addTask, updateTask } = require(controllerPath);
const router = express.Router();
router.get("/tasks", getAllTask);
router.post("/tasks", addTask);
router.put("/tasks/:id", updateTask);
module.exports = router;
