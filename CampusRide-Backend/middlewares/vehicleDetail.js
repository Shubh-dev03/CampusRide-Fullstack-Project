// Must be used AFTER authMiddleware — relies on req.user being set
// This replaces any role-based "isDriver" check with a data-driven one

const hasVehicleDetails = (req, res, next) => {
  if (!req.user?.vehicleDetails) {
    return res.status(400).json({
      success: false,
      message: "Vehicle details required to offer a ride.",
      code: "NO_VEHICLE_DETAILS", // lets the frontend trigger the car-details modal
    });
  }
  next();
};

module.exports = hasVehicleDetails;
