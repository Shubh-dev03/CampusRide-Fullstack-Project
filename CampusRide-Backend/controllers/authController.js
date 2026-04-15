const bcrypt = require("bcryptjs");
const { User } = require("../models/userModel");
const JWT = require("jsonwebtoken");

// REGISTER CONTROLLER
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    console.log(req.body);
    // Validation
    if (!["rider", "driver"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be either 'rider' or 'driver'.",
      });
    }

    //Check If the user already exist
    const user = await User.findOne({ email });

    if (user) {
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
      role,
    });
    res.status(201).json({
      success: true,
      message: "Registered successfully!",
      user: newUser,
    });
  } catch (error) {
    console.log("Error detected", error);
    res.status(500).json({
      success: false,
      message: "Error detected",
      error,
    });
  }
};

// LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Request Body:", req.body);

    //Find user in DB using email
    const user = await User.findOne({ email });
    console.log("DataBase User:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found.Please register",
      });
    }
    //Comparing Passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password.",
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
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
};

module.exports = { registerController, loginController };
