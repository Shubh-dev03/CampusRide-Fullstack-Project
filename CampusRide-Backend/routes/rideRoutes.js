const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getAllRides,
  bookRide,
  cancelRide,
  myBookings,
  myRides,
  searchRides,
  createRide,
  editRide,
  deleteRide,
  getRideById,
  fecthAllRides,
} = require("../controllers/rideController");

// Public Routes
router.get("/", getAllRides);
router.get("/search", searchRides);

// Protected Routes
router.post("/create", authMiddleware, createRide);
router.get("/mybookings", authMiddleware, myBookings);
router.get("/myrides", authMiddleware, myRides);
router.get("/allrides", authMiddleware, fecthAllRides);

router.get("/:rideId", authMiddleware, getRideById);
router.post("/cancel/:rideId", authMiddleware, cancelRide);
router.delete("/:rideId", authMiddleware, deleteRide);
router.patch("/edit/:rideId", authMiddleware, editRide);
router.post("/book/:rideId", authMiddleware, bookRide);

module.exports = router;
