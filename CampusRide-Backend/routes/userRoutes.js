const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/getuser", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected route Working",
    userId: req.userId,
  });
});

module.exports = router;
