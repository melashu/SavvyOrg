const mongoose = require("mongoose");

const testimonySchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  testimony: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Testimony", testimonySchema);
