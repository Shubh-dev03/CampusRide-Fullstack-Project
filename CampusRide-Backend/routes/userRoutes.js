const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getUser,
  updateVehicleDetails,
} = require("../controllers/userController");

// GET /api/users/getuser  — returns full user profile including vehicleDetails
router.get("/getuser", authMiddleware, getUser);

// PATCH /api/users/vehicle-details  — add/update vehicle info
// Frontend calls this when user wants to offer a ride but has no car on file
router.patch("/vehicle-details", authMiddleware, updateVehicleDetails);

module.exports = router;
