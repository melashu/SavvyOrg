const asyncHandler = require("express-async-handler");
const Testimony = require("../models/testimony.js");

// @desc create a new testimony
// @route POST /api/testimonies/
// @access PUBLIC
const createTestimony = asyncHandler(async (req, res) => {
  const { name, role, testimony } = req.body;

  console.log("testimony controller");
  console.log(req.body);
  console.log("testimony controller");

  try {
    const testimonial = await Testimony.create({
      name,
      role,
      testimony,
    });

    console.log("testimonial");
    console.log(testimonial);
    console.log("testimonial");

    if (testimonial) {
      return res.json({
        message: "Testimony created successfully",
        testimony: {
          id: testimonial._id,
          name: testimonial.name,
          testimony: testimonial.testimony,
        },
      });
    }
  } catch (error) {
    console.error("Error creating testimony:", error);
    return res.json({ message: "Server error" });
  }
});

module.exports = {
  createTestimony,
};
