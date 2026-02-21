// src/services/tripService.js
const prisma = require('../config/prisma');

const getAllTrips = async () => {
    return await prisma.trip.findMany({
        include: { vehicle: true, driver: true },
        orderBy: { createdAt: 'desc' }
    });
};

const createTrip = async (data) => {
  const { vehicleId, driverId, cargoWeight } = data;

  // 1. Validate Vehicle
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new Error("Vehicle not found");
  if (vehicle.status !== 'AVAILABLE') throw new Error("Vehicle is not AVAILABLE");
  if (cargoWeight > vehicle.maxCapacity) throw new Error("Cargo exceeds vehicle capacity");

  // 2. Validate Driver
  const driver = await prisma.driver.findUnique({ where: { id: driverId } });
  if (!driver) throw new Error("Driver not found");
  if (driver.status !== 'ON_DUTY') throw new Error("Driver is not ON_DUTY");
  if (new Date(driver.licenseExpiry) < new Date()) throw new Error("Driver license expired");

  // 3. Create Trip & Update Statuses
  return await prisma.$transaction(async (prisma) => {
    const trip = await prisma.trip.create({
      data: {
        ...data,
        status: 'DISPATCHED',
        startOdo: vehicle.odometer
      }
    });

    await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status: 'ON_TRIP' }
    });

    await prisma.driver.update({
        where: { id: driverId },
        data: { status: 'ON_TRIP' }
    });

    return trip;
  });
};

const completeTrip = async (id, completeData) => {
    const trip = await prisma.trip.findUnique({ where: { id } });
    if(!trip) throw new Error("Trip not found");
    if(trip.status !== 'DISPATCHED') throw new Error("Trip is not active");

    return await prisma.$transaction(async (prisma) => {
        const updatedTrip = await prisma.trip.update({
            where: { id },
            data: {
                status: 'COMPLETED',
                endOdo: completeData.endOdo
            }
        });

        // Update Vehicle info
        await prisma.vehicle.update({
            where: { id: trip.vehicleId },
            data: { 
                status: 'AVAILABLE',
                odometer: completeData.endOdo 
            }
        });

        // Update Driver status
        await prisma.driver.update({
            where: { id: trip.driverId },
            data: { status: 'ON_DUTY' }
        });

        return updatedTrip;
    });
};

module.exports = { getAllTrips, createTrip, completeTrip };
