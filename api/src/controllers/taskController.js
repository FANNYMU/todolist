const taskService = require("../services/taskService");

const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const addTask = async (req, res, next) => {
  try {
    const { task } = req.body;
    const newTask = await taskService.createTask(task);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

const completeTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const updatedTask = await taskService.updateTask(id, completed);
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const removeTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await taskService.deleteTask(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, addTask, completeTask, removeTask };
