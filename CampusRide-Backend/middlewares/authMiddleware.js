const JWT = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    //Get token from headers
    const authHeader = req.headers.authorization;

    //If no token provided
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided.",
      });
    }
    //Extract token from "Bearer token"
    const token = authHeader.split(" ")[1];

    //verify token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    //Attach userId to request
    req.userId = decoded.id;

    //Continue to next controller
    next();
  } catch (error) {
    console.log("Error in Middleware", error);
    res.status(401).json({ success: false, message: "Error in Middleware" });
  }
};

module.exports = authMiddleware;
