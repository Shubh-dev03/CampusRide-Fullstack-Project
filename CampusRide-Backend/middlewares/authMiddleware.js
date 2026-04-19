const JWT = require("jsonwebtoken");
const { User } = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    //Get token from headers
    const authHeader = req.headers.authorization;

    //If no token provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided.",
      });
    }
    //Extract token from "Bearer token"
    const token = authHeader.split(" ")[1];

    //verify token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // Fetch full user and attach to req
    // This means downstream middleware (hasVehicleDetails) and
    // controllers never need to make their own DB call for user data
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // kept for backward compatibility
    req.userId = decoded.id;
    // full user object — use this going forward
    req.user = user;
    //Continue to next controller
    next();
  } catch (error) {
    // Surface the actual reason instead of swallowing it
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Invalid token. Please log in again.";
    console.log("AUTH MIDDLEWARE ERROR:", error.message);
    console.log("AUTH HEADER:", req.headers.authorization);

    res.status(401).json({ success: false, message: "Error in Middleware" });
  }
};

module.exports = authMiddleware;
