const { User } = require("../models/userModel");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customsError");

// GET /api/users/getuser
// Returns the full user profile (req.user already attached by authMiddleware)
const getUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: req.user,
  });
});

// PATCH /api/users/vehicle-details
// Adds or updates vehicle details for the authenticated user
// Once saved, this user can offer rides (hasVehicleDetails middleware will pass)
const updateVehicleDetails = asyncHandler(async (req, res) => {
  const { make, model, licensePlate, capacity } = req.body;

  if (!make || !model || !licensePlate || !capacity) {
    throw new CustomError(
      "All vehicle fields are required: make, model, licensePlate, capacity",
      400,
    );
  }

  if (capacity < 1 || capacity > 10) {
    throw new CustomError("Capacity must be between 1 and 10", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.userId,
    {
      vehicleDetails: {
        make: make.trim(),
        model: model.trim(),
        licensePlate: licensePlate.trim().toUpperCase(),
        capacity: Number(capacity),
      },
    },
    { new: true, runValidators: true },
  ).select("-password");

  if (!updatedUser) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Vehicle details saved successfully",
    data: updatedUser,
  });
});

module.exports = { getUser, updateVehicleDetails };
