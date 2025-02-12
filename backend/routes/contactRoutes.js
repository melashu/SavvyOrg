// routes/contactRoutes.js

const express = require("express");
const router = express.Router();
const {
  contactUs,
  getContactMessages,
  streamMessages,
} = require("../controllers/contact_us");

router.post("/contact_us", contactUs.sendMessage);
// Define the route to get contact messages
router.get("/messages", getContactMessages);

// Route to stream messages (SSE connection)
router.get("/stream", streamMessages);

module.exports = router;
