const dotenv = require("dotenv");
const transporter = require("../utils/transporter.js");
const generateToken = require("../utils/generateToken.js");
const frontendURL = require("../constant/url.js");

dotenv.config();

const sendMail = async (id, role, email, option) => {
  try {
    let mailOptions;
    if (option === "email verification") {
      const emailToken = generateToken(id, role, "email");
      const url = `${frontendURL}/user/confirm/${emailToken}`;
      mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Confirm your email for Savvy Bridge",
        html: `
          <div>
            <h2>Account Created!</h2>
            Click this link to 
            <a href="${url}">verify your account</a>.
            <br>Note: This link is valid for 15 minutes.
          </div>
        `,
      };
    } else if (option === "forgot password") {
      const resetToken = generateToken(id, role, "forgot password");
      const url = `${frontendURL}/user/password/reset/${resetToken}`;

      mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Reset Password for Savvy Bridge",
        html: `
          <div>
            <h2>Reset Password for your Savvy Bridge account</h2>
            <br>Forgot your password? No worries! Click this link to 
            <a href="${url}">reset your password</a>.
            <br>Note: This link is valid for 10 minutes.
          </div>
        `,
      };
    }

    // Send the email using Nodemailer
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendMail;
