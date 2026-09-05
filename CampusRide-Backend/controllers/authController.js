const bcrypt = require("bcryptjs");
const { User } = require("../models/userModel");
const JWT = require("jsonwebtoken");

// REGISTER CONTROLLER
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    //Check If the user already exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }
    //Hash |Password
    const saltRounds = 10; //Complexity of the hash
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //Create a new user
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    res.status(201).json({
      success: true,
      message: "Registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        vehicleDetails: newUser.vehicleDetails, // null on register, always
      },
    });
  } catch (error) {
    console.log("Register error", error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again",
    });
  }
};

// LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Find user in DB using email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email. Please register.",
      });
    }
    //Comparing Passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password.",
      });
    }
    //Generate JWT Token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({
      success: true,
      message: "Login successfull!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        vehicleDetails: user.vehicleDetails ?? null,
        // vehicleDetails being non-null tells the frontend
        // this user can offer rides without hitting an extra endpoint
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Login Failed. Please try again.",
    });
  }
};

module.exports = { registerController, loginController };
