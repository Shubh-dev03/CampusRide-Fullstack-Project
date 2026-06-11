const express = require("express");
const router = express.Router();

const { chatRoute } = require("../controllers/chatController.js");

router.post("/", chatRoute);

module.exports = router;
