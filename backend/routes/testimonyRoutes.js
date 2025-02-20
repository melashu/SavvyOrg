const express = require("express");
const {
  createTestimony,
  getAllTestimonies,
} = require("../controllers/testimonyController");

const router = express.Router();

router.route("/").post(createTestimony).get(getAllTestimonies);

module.exports = router;
