const jwt = require("jsonwebtoken");

// generate a JWT token for the various applications represented by the 'option' argument
const generateToken = (id, role, option) => {
  const payload = { id, role }; // Include both id and role in the payload

  if (option === "access") {
    return jwt.sign(payload, "yilkal_jwt", {
      expiresIn: 2 * 60 * 60, // 2 hours
    });
  } else if (option === "refresh") {
    return jwt.sign(payload, "ayinalem_token", {
      expiresIn: "7d", // 7 days
    });
  } else if (option === "email") {
    return jwt.sign(payload, "derseh_jwt", {
      expiresIn: 15 * 60, // 15 minutes
    });
  } else if (option === "forgot password") {
    return jwt.sign(payload, "forgot_password", {
      expiresIn: 10 * 60, // 10 minutes
    });
  }
};

module.exports = generateToken;
