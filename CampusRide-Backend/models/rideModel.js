const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    rideTime: {
      type: String,
      required: true,
    },
    rideFare: { type: Number, required: true },
    availableSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    passengers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const Ride = mongoose.model("Ride", rideSchema);

module.exports = Ride;
