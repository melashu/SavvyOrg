const express = require("express");
const { createTestimony } = require("../controllers/testrimonyController");

const router = express.Router();

router.route("/").post(createTestimony);

module.exports = router;
