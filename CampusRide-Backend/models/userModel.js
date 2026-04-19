const mongoose = require("mongoose");

const vehicleDetailsSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    licensePlate: { type: String, required: true, trim: true, uppercase: true },
    capacity: { type: Number, required: true, min: 1, max: 10 },
  },
  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },

    vehicleDetails: {
      type: vehicleDetailsSchema,
      default: null,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
