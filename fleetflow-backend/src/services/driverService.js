// src/services/driverService.js
const prisma = require('../config/prisma');

const getAllDrivers = async () => {
  return await prisma.driver.findMany({
    orderBy: { name: 'asc' }
  });
};

const createDriver = async (data) => {
  return await prisma.driver.create({ data });
};

const getDriverById = async (id) => {
  return await prisma.driver.findUnique({ where: { id } });
};

module.exports = {
  getAllDrivers,
  createDriver,
  getDriverById
};
