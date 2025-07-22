const path = require("path");
const modelPath = path.join(__dirname, "..", "model", "tasks");
const task = require(modelPath);

const getAllTask = async (req, res) => {
  try {
    const tasks = await task.find();
    res.json(tasks);
    console.log("success");
  } catch (err) {
    console.log("error while getalltask:   ", err);
  }
};

// const addTask = async (req, res) => {

// };

module.exports = getAllTask;
