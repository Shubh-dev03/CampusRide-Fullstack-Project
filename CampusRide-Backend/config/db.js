const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGO_DB Connected successfully!!");
  } catch (error) {
    console.log("Error in DataBase connection.", error);
  }
};

module.exports = connectDB;
