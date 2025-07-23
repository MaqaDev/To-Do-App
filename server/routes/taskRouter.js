const express = require("express");
const path = require("path");
const controllerPath = path.join(
  __dirname,
  "..",
  "controllers",
  "taskController"
);
const { getAllTask, addTask } = require(controllerPath);
const router = express.Router();
router.get("/tasks", getAllTask);
router.post("/tasks", addTask);
module.exports = router;
