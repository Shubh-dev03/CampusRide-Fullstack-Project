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
      type: String, // 1. Changed from Number to String
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        // 2. Custom validator ensuring it contains exactly 10 digits
        validator: function (v) {
          return /^\d{10}\$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
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
