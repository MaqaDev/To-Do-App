const express = require("express");
const path = require("path");
const controllerPath = path.join(
  __dirname,
  "..",
  "controllers",
  "taskController"
);
const getAllTask = require(controllerPath);
const router = express.Router();
router.get("/", getAllTask);
module.exports = router;
