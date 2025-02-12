const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");

const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, "yilkal_jwt");

      req.user = await User.findById(decodedToken.id).select("-password");
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        res.status(401);
        throw new Error("Token expired, please log in again");
      } else {
        console.log(error);
        res.status(401);
        throw new Error("Not authorised, token failed");
      }
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token available");
  }
});

const isAdmin = (req, res, next) => {
  if (req.user.role == "admin") next();
  else {
    res.status(401);
    throw new Error("Not authorised admin");
  }
};
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Header key in lowercase

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'
  if (!token) {
    return res.status(403).json({ message: "Token missing" });
  }

  try {
    const verifiedUser = jwt.verify(token, "yilkal_jwt");
    req.user = verifiedUser;
    next();
  } catch (err) {
    console.log("Invalid Token:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { protectRoute, verifyToken, isAdmin };
