const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getAllTasks = async () => {
  return await prisma.task.findMany();
};

const createTask = async (task) => {
  return await prisma.task.create({
    data: { task, completed: false },
  });
};

const updateTask = async (id, completed) => {
  return await prisma.task.update({
    where: { id: Number(id) },
    data: { completed },
  });
};

const deleteTask = async (id) => {
  return await prisma.task.delete({
    where: { id: Number(id) },
  });
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
