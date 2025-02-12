const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Send reset password email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "yilkalderseh@gmail.com",
    pass: "yhwa isun lhfc akpe",
  },
});
module.exports = transporter;
