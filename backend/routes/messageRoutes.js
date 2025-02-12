const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// Get all messages
router.get("/", messageController.getMessages);

// Create a new message
router.post("/", messageController.createMessage);

module.exports = router;
