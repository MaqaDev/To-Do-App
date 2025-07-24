const { response } = require("express");
const path = require("path");
const modelPath = path.join(__dirname, "..", "model", "tasks");
const task = require(modelPath);

const getAllTask = async (req, res) => {
  try {
    const tasks = await task.find();
    res.json(tasks);
  } catch (err) {
    console.log("error while getalltask:   ", err);
  }
};

const addTask = async (req, res) => {
  try {
    const { taskId, taskName, Completed } = req.body;
    await task.create({
      taskId,
      taskName,
      Completed,
    });
    res.status(201).json(task);
    console.log("task added db");
  } catch (error) {
    console.log("Error while add task to db backend :", error);
  }
};

const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const { taskName, Completed } = req.body;
    const response = await task.findOneAndUpdate(
      { taskId: id },
      { taskName: taskName, Completed: Completed },
      { new: true }
    );
    res.json(response);
  } catch (error) {
    console.log("Error while edit task : ", error);
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const response = await task.deleteOne({ taskId: id });
    res.json(response);
  } catch (error) {
    console.log("Error while delete task: ", error);
  }
};

const deleteAllTask = async (req, res) => {
  const response = await task.deleteMany();
  res.json(response);
};

module.exports = { getAllTask, addTask, updateTask, deleteTask, deleteAllTask };
