const { default: mongoose } = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const Ride = require("../models/rideModel");
const CustomError = require("../utils/customsError");

// # Create Ride
const createRide = asyncHandler(async (req, res) => {
  const { from, to, rideTime, rideFare, availableSeats } = req.body;

  // Validation
  if (!from || !to || !rideTime || !rideFare || availableSeats === undefined) {
    throw new CustomError("All fields are required", 400);
  }

  if (rideFare < 0) {
    throw new CustomError("Fare cannot be negative", 400);
  }

  if (availableSeats < 0) {
    throw new CustomError("Seats cannot be negative", 400);
  }

  // Prevent duplicate ride at same time
  const existingRide = await Ride.findOne({
    driver: req.userId,
    rideTime,
  });

  if (existingRide) {
    throw new CustomError("Ride already exists at this time", 400);
  }

  // Create ride
  const newRide = await Ride.create({
    driver: req.userId,
    from,
    to,
    rideTime,
    rideFare,
    availableSeats,
    passengers: [],
  });

  res.status(201).json({
    success: true,
    message: "Ride created successfully",
    data: newRide,
  });
});

// # Get All Rides
const getAllRides = asyncHandler(async (req, res) => {
  const rides = await Ride.find({ availableSeats: { $gt: 0 } });

  res.status(200).json({
    success: true,
    message: "Rides fetched successfully",
    data: rides,
  });
});

// # Book Ride
const bookRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;

  const ride = await Ride.findById(rideId);
  if (!ride) throw new CustomError("Ride not found", 404);

  if (ride.driver.toString() === req.userId) {
    throw new CustomError("You cannot book your own ride", 400);
  }

  if (ride.availableSeats <= 0) {
    throw new CustomError("No seats available", 400);
  }

  const alreadyBooked = ride.passengers.some(
    (id) => id.toString() === req.userId,
  );

  if (alreadyBooked) {
    throw new CustomError("You already booked this ride", 400);
  }

  ride.passengers.push(req.userId);
  ride.availableSeats -= 1;

  await ride.save();

  res.status(200).json({
    success: true,
    message: "Ride booked successfully",
    data: ride,
  });
});

// # Cancel Ride
const cancelRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;

  const ride = await Ride.findById(rideId);
  if (!ride) throw new CustomError("Ride not found", 404);

  const isPassenger = ride.passengers.some(
    (id) => id.toString() === req.userId,
  );

  if (!isPassenger) {
    throw new CustomError("You have not booked this ride", 400);
  }

  // Remove user from passengers
  ride.passengers = ride.passengers.filter(
    (id) => id.toString() !== req.userId,
  );

  // increases seats
  ride.availableSeats += 1;

  await ride.save();

  res.status(200).json({
    success: true,
    message: "Ride cancelled successfully",
    data: ride,
  });
});

// # My Bookings
const myBookings = asyncHandler(async (req, res) => {
  const rides = await Ride.find({ passengers: req.userId }).populate(
    "driver",
    "name email",
  );

  res.status(200).json({
    success: true,
    message: rides.length === 0 ? "No bookings found" : "Your bookings",
    data: rides,
  });
});
// Delete Ride
const deleteRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new CustomError("Ride not found", 404);
  }

  if (ride.driver.toString() !== req.userId) {
    throw new CustomError("Unauthorized to delete this ride", 403);
  }

  await Ride.findByIdAndDelete(rideId);

  res.status(200).json({
    success: true,
    message: "Ride deleted successfully",
  });
});

// # My Rides
const myRides = asyncHandler(async (req, res) => {
  const rides = await Ride.find({ driver: req.userId }).populate(
    "passengers",
    "name email",
  );

  res.status(200).json({
    success: true,
    message: rides.length === 0 ? "No rides posted" : "Your rides",
    data: rides,
  });
});

// # Search single Ride by id
const getRideById = asyncHandler(async (req, res) => {
  const { rideId } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(rideId)) {
    throw new CustomError("Invalid ride ID", 400);
  }
  console.log("Received Id :", rideId);

  //  Find ride and populate driver and passengers
  const ride = await Ride.findById(rideId)
    .populate("driver", "name email")
    .populate("passengers", "name email phone");

  // Check if ride exists
  if (!ride) {
    throw new CustomError("Ride not found", 404);
  }

  // Only driver and passengers can view ride details
  if (
    ride.driver._id.toString() !== req.userId &&
    !ride.passengers.some((id) => id.toString() === req.userId)
  ) {
    throw new CustomError("Unauthorized to view this ride", 403);
  }
  // Response
  res.status(200).json({
    success: true,
    message: "Ride fetched successfully",
    data: ride,
  });
});

// # Search Rides
const searchRides = asyncHandler(async (req, res) => {
  const { from, to, rideTime } = req.query;

  const query = {
    availableSeats: { $gt: 0 },
  };

  if (from) query.from = new RegExp(from.trim(), "i");
  if (to) query.to = new RegExp(to.trim(), "i");
  if (rideTime) query.rideTime = rideTime;

  const rides = await Ride.find(query);

  res.status(200).json({
    success: true,
    message: "Filtered rides",
    count: rides.length,
    data: rides,
  });
});

// # Edit Ride
const editRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const { from, to, rideTime, rideFare, availableSeats } = req.body;

  // At least one field required
  if (
    [from, to, rideTime, rideFare, availableSeats].every((v) => v === undefined)
  ) {
    throw new CustomError("At least one field is required to update", 400);
  }

  const ride = await Ride.findById(rideId);
  if (!ride) throw new CustomError("Ride not found", 404);

  if (ride.driver.toString() !== req.userId) {
    throw new CustomError("Unauthorized to edit this ride", 403);
  }

  if (rideFare !== undefined && rideFare < 0) {
    throw new CustomError("Fare cannot be negative", 400);
  }

  if (availableSeats !== undefined && availableSeats < 0) {
    throw new CustomError("Seats cannot be negative", 400);
  }

  ride.from = from ?? ride.from;
  ride.to = to ?? ride.to;
  ride.rideTime = rideTime ?? ride.rideTime;
  ride.rideFare = rideFare ?? ride.rideFare;
  ride.availableSeats = availableSeats ?? ride.availableSeats;

  await ride.save();

  res.status(200).json({
    success: true,
    message: "Ride updated successfully",
    data: ride,
  });
});

// #Get all Rides
const fecthAllRides = asyncHandler(async (req, res) => {
  const rides = await Ride.find({ availableSeats: { $gt: 0 } });

  if (!rides) {
    throw new CustomError("API failed to fetch allRides", 500);
  }
  res.status(200).json({
    success: true,
    message: "All rides fetched successfully",
    data: rides,
  });
});

module.exports = {
  createRide,
  getAllRides,
  bookRide,
  cancelRide,
  deleteRide,
  myBookings,
  myRides,
  fecthAllRides,
  searchRides,
  editRide,
  getRideById,
};
