const asyncHandler = require("express-async-handler");
const Testimony = require("../models/testimony.js");

// @desc Create a new testimony
// @route POST /api/testimonies/
// @access PUBLIC
const createTestimony = asyncHandler(async (req, res) => {
  const { name, company, role, testimony } = req.body;

  console.log("testimony controller");
  console.log(req.body);
  console.log("testimony controller");

  try {
    const testimonial = await Testimony.create({
      name,
      company,
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
          company: testimonial.company,
          testimony: testimonial.testimony,
        },
      });
    }
  } catch (error) {
    console.error("Error creating testimony:", error);
    return res.json({ message: "Server error" });
  }
});

// @desc Get all testimonies
// @route GET /api/testimonies/
// @access PUBLIC
const getAllTestimonies = asyncHandler(async (req, res) => {
  try {
    const testimonies = await Testimony.find({});

    if (testimonies.length > 0) {
      return res.json({
        message: "Testimonies fetched successfully",
        testimonies: testimonies.map((testimony) => ({
          id: testimony._id,
          name: testimony.name,
          company: testimony.company,
          role: testimony.role,
          testimony: testimony.testimony,
          image: "/images/profile.jpg",
        })),
      });
    } else {
      return res.json({ message: "No testimonies found" });
    }
  } catch (error) {
    console.error("Error fetching testimonies:", error);
    return res.json({ message: "Server error" });
  }
});

module.exports = {
  createTestimony,
  getAllTestimonies,
};
