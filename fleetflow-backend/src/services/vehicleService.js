// src/services/vehicleService.js
const prisma = require('../config/prisma');

const getAllVehicles = async (filters) => {
  return await prisma.vehicle.findMany({
    where: filters,
    orderBy: { createdAt: 'desc' }
  });
};

const getVehicleById = async (id) => {
  return await prisma.vehicle.findUnique({
    where: { id },
    include: { trips: true, maintenanceLogs: true }
  });
};

const createVehicle = async (data) => {
  return await prisma.vehicle.create({ data });
};

const updateVehicle = async (id, data) => {
  return await prisma.vehicle.update({
    where: { id },
    data
  });
};

const deleteVehicle = async (id) => {
  return await prisma.vehicle.delete({
    where: { id }
  });
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
