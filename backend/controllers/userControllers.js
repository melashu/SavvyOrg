const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const Token = require("../models/tokenModel.js");
const generateToken = require("../utils/generateToken.js");
const sendMail = require("../utils/sendMail.js");
const generateGravatar = require("../utils/generateGravatar.js");
const jwt = require("jsonwebtoken");
const frontendURL = require("../constant/url.js");
const { encrypt, decrypt } = require("../utils/cryptoUtils"); // Adjust path as needed

// @desc Get all the users info
// @route GET /api/users
// @access PRIVATE/ADMINsss
const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1; // the current page number in the pagination
  const role = req.query.role;
  const searchQuery = req.query.searchQuery;
  const pageSize = 5; // total number of entries on a single page

  const admins = await User.countDocuments({ isDeleted: false, role: "admin" });
  const authors = await User.countDocuments({
    isDeleted: false,
    role: "author",
  });
  const customers = await User.countDocuments({
    isDeleted: false,
    role: "customer",
  });

  let filter = {};
  filter.role = role;
  filter.isDeleted = false;

  if (searchQuery != "undefined" || searchQuery != null || searchQuery != "") {
    filter.$or = [
      { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive name search
      { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive email search
    ];
  }

  const count = await User.countDocuments(filter); // total number of documents available
  const allUsers = await User.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort("-createdAt");
  res.json({
    users: allUsers,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
    admins: admins,
    authors: authors,
    customers: customers,
  });
});

const getAllArchivedUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1; // the current page number in the pagination
  const pageSize = 5; // total number of entries on a single page

  const searchQuery = req.query.searchQuery;

  const archivedAdmins = await User.countDocuments({
    isDeleted: true,
    role: "admin",
  });
  const archivedAuthors = await User.countDocuments({
    isDeleted: true,
    role: "author",
  });
  const archivedCustomers = await User.countDocuments({
    isDeleted: true,
    role: "customer",
  });

  let filter = {};
  filter.isDeleted = true;

  if (searchQuery != "undefined" || searchQuery != null || searchQuery != "") {
    filter.$or = [
      { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive name search
      { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive email search
    ];
  }

  const count = await User.countDocuments(filter); // total number of documents available
  const allArchivedUsers = await User.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort("-createdAt");
  res.json({
    archivedUsers: allArchivedUsers,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
    archivedAdmins: archivedAdmins,
    archivedAuthors: archivedAuthors,
    archivedCustomers: archivedCustomers,
  });
});

const getAllUsersForChat = asyncHandler(async (req, res) => {
  const allUsers = await User.find({ isDeleted: false }).sort("-createdAt");
  res.json({
    users: allUsers,
  });
});

const getAllAuthors = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1; // Current page number
  const pageSize = 6; // Set to 5 entries per page to increase performance

  // Count only users with the role of 'author'

  const count = await User.countDocuments({ role: "author" });

  // Find authors and apply pagination
  const allAuthors = await User.find({ role: "author" })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort("-createdAt")
    .lean();

  // Send paginated data
  res.json({
    users: allAuthors,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc Delete a user
// @route DELETE /api/users/:id
// @access PRIVATE/ADMIN
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: `User ${user.name} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});
// @desc get user by ID
// @route GET /api/users/:id
// @access PRIVATE/ADMIN
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) res.json(user);
  else {
    res.status(404);
    throw new Error("User does not exist");
  }
});
// @desc update user from the admin panel
// @route PUT /api/users/:id
// @access PRIVATE/ADMIN
const updateUser = asyncHandler(async (req, res) => {
  // do not include the hashed password when fetching this user
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    // update whicever field was sent in the rquest body
    user.name = req.body.name || user.name;
    user.isConfirmed = req.body.email === user.email;
    user.email = req.body.email || user.email;
    user.role = req.body.role;
    const updatedUser = await user.save();
    if (updatedUser) {
      res.json({
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isConfirmed: updatedUser.isConfirmed,
      });
    }
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});
// @desc authenticate user and get token
// @route POST /api/users/login
// @access PUBLIC

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let url = `${frontendURL}`;

  // Retrieve user and token data in parallel to save time
  const [user, existingToken] = await Promise.all([
    User.findOne({ email }),
    Token.findOne({ email }),
  ]);

  // Check if user exists, password is correct, and account is confirmed
  if (user && (await user.matchPassword(password)) && user.isConfirmed) {
    // Generate tokens
    const accessToken = generateToken(user._id, user.role, "access");
    const refreshToken = generateToken(user._id, user.role, "refresh");

    // Update or create the refresh token in the database
    if (existingToken) {
      existingToken.token = refreshToken;
      await existingToken.save();
    } else {
      await Token.create({ email, token: refreshToken });
    }

    // Set dashboard URL based on user role
    const roleUrls = {
      admin: `admin/dashboard`,
      author: `author/dashboard`,
      customer: `customer/dashboard`,
    };
    url = roleUrls[user.role] || url;

    // Encrypt user ID and prepare it for the response
    const { encryptedData, iv, key } = encrypt(user._id.toString());
    const encryptedPackage = JSON.stringify({ encryptedData, iv, key });

    // Send response
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isConfirmed: user.isConfirmed,
      avatar: user.avatar,
      accessToken,
      refreshToken,
      url,
      encryptedPackage,
    });
  } else {
    res
      .status(401)
      .json({ message: user ? "Invalid Password" : "Invalid Email" });
  }
});

// @desc register a new user
// @route POST /api/users/
// @access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.json({ message: "Email already registered" });
  }

  const avatar = generateGravatar(email);
  const role = "customer";

  try {
    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar,
    });

    if (user) {
      // Send email verification link
      const emailSent = await sendMail(
        user._id,
        user.role,
        email,
        "email verification"
      );

      if (emailSent) {
        const refreshToken = generateToken(user._id, user.role, "refresh");
        const accessToken = generateToken(user._id, user.role, "access");

        return res.json({
          message: "User registered successfully",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role,
            avatar,
            isConfirmed: user.isConfirmed,
          },
          accessToken,
          refreshToken,
        });
      } else {
        // If email sending failed
        return res.json({
          message: "User registered, but email verification failed to send.",
        });
      }
    } else {
      return res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.json({ message: "Server error" });
  }
});

// @desc send a mail with the link to verify mail
// @route POST /api/users/confirm
// @access PUBLIC
const mailForEmailVerification = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      // send a verification email, if this user is not a confirmed email
      if (!user.isConfirmed) {
        // send the mail
        await sendMail(user._id, user.role, email, "email verification");
        res.status(200).json({
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          isConfirmed: user.isConfirmed,
          message: "User registered successfully",
        });
      } else {
        res.status(400);
        throw new Error("User already confirmed");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Could not send the mail. Please retry.");
  }
});

// @desc send a mail with the link to reset password
// @route POST /api/users/reset
// @access PUBLIC
const mailForPasswordReset = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // send a link to reset password only if it's a confirmed account
    if (user && user.isConfirmed) {
      // send the mail and return the user details

      // the sendMail util function takes a 3rd argument to indicate what type of mail to send
      await sendMail(user._id, user.role, email, "forgot password");

      res.status(200).json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isConfirmed: user.isConfirmed,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Could not send the mail. Please retry.");
  }
});

// @desc reset password of any verified user
// @route PUT /api/users/reset
// @access PUBLIC
const resetUserPassword = asyncHandler(async (req, res) => {
  console.log("Reset User Password Controller");

  try {
    const passwordToken = req.params.token; // Access the token from the URL
    const { password } = req.body;
    const decodedToken = jwt.verify(passwordToken, "forgot_password");
    const user = await User.findById(decodedToken.id);

    if (user && password) {
      user.password = password;
      const updatedUser = await user.save();

      if (updatedUser) {
        res.status(200).json({
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          role: updatedUser.role,
        });
      } else {
        res.status(401);
        throw new Error("Unable to update password");
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error("User not found.");
  }
});

// @desc confirm the email address of the registered user
// @route GET /api/users/confirm
// @access PUBLIC
const confirmUser = asyncHandler(async (req, res) => {
  try {
    // set the user to a confirmed status, once the corresponding JWT is verified correctly
    const emailToken = req.params.token;
    const decodedToken = jwt.verify(emailToken, "derseh_jwt");
    const user = await User.findById(decodedToken.id).select("-password");
    user.isConfirmed = true;
    const updatedUser = await user.save();
    const foundToken = await Token.findOne({ email: updatedUser.email }); // send the refresh token that was stored
    res.json({
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      isConfirmed: updatedUser.isConfirmed,
      accessToken: generateToken(user._id, user.role, "access"),
      refreshToken: foundToken,
    });
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Not authorised. Token failed");
  }
});

// @desc obtain new access tokens using the refresh tokens
// @route GET /api/users/refresh
// @access PUBLIC
const getAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.body.token;
  const email = req.body.email;

  // search if currently loggedin user has the refreshToken sent
  const currentAccessToken = await Token.findOne({ email });

  if (!refreshToken || refreshToken !== currentAccessToken.token) {
    res.status(400);
    throw new Error("Refresh token not found, login again");
  }

  // If the refresh token is valid, create a new accessToken and return it.
  jwt.verify(refreshToken, "ayinalem_token", (err, user) => {
    if (!err) {
      const accessToken = generateToken(user.id, user.role, "access");
      return res.json({ success: true, accessToken });
    } else {
      return res.json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  });
});

// @desc get user data for google login in the frontend
// @route POST /api/users/passport/data
// @access PUBLIC
const getUserData = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);
  if (user) {
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      isConfirmed: user.isConfirmed,
    });
  } else {
    res.status(400);
    throw new Error("User not authorised to view this page");
  }
});

// @desc get data for an authenticated user
// @route GET /api/users/profile
// @access PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
  console.log("get user profile data");

  const { accessId } = req.query;
  let decryptedData;

  if (accessId) {
    // Parse the JSON string back to an object
    decryptedData = JSON.parse(accessId);
  } else {
    console.log("No accessEmail data found in query.");
  }

  const decryptedId = decrypt(
    decryptedData.encryptedData,
    decryptedData.key,
    decryptedData.iv
  ); // Decrypt an id

  const user = await User.findById(decryptedId);
  if (user) {
    res.json({
      id: user._id,
      email: user.email,
      bio: user.bio,
      socialLinks: user.socialLinks,
      avatar: user.avatar,
      name: user.name,
      role: user.role,
      profilePic: user.profilePic,
    });
  } else {
    res.status(400);
    throw new Error("User not authorised to view this page");
  }
});

// Profile update handler
const updateUserProfile = asyncHandler(async (req, res) => {
  const { accessId } = req.query;
  let decryptedData;
  if (accessId) {
    decryptedData = JSON.parse(accessId); // Decrypt accessId
  } else {
    return res.status(400).json({ message: "No accessId provided" });
  }

  const decryptedId = decrypt(
    decryptedData.encryptedData,
    decryptedData.key,
    decryptedData.iv
  );
  const user = await User.findById(decryptedId);

  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  // Update the user profile fields
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.bio = req.body.bio || user.bio;
  user.socialLinks.facebook = req.body.facebook || user.socialLinks.facebook;
  user.socialLinks.linkedin = req.body.linkedin || user.socialLinks.linkedin;
  user.socialLinks.twitter = req.body.twitter || user.socialLinks.twitter;

  // Handle profile picture upload if a file is provided
  if (req.file) {
    const profilePicturePath = req.file.path;
    user.profilePic = profilePicturePath; // Save the image path to the database
  }

  // Save the updated user information
  const updatedUser = await user.save();

  // Respond with the updated user data
  res.json({
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    bio: updatedUser.bio,
    socialLinks: updatedUser.socialLinks,
    profilePic: updatedUser.profilePic, // Include the profile picture path in the response
  });
});

const getUserRole = (req, res) => {
  res.json({ role: req.user.role });
};

// Change User Role
const changeUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["customer", "admin", "author"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
};

// Change User Role
const moveUserToArchived = async (req, res) => {
  const { userId } = req.params;
  const { isDeleted } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = isDeleted;
    await user.save();

    res.json({ message: `move to archived`, user });
  } catch (err) {
    res.status(500).json({ message: "Error moving into archived" });
  }
};

module.exports = {
  authUser,
  getUserProfile,
  getUserData,
  getAccessToken,
  registerUser,
  confirmUser,
  mailForEmailVerification,
  mailForPasswordReset,
  resetUserPassword,
  updateUserProfile,
  getAllUsers,
  getAllArchivedUsers,
  getAllUsersForChat,
  getAllAuthors,
  deleteUser,
  getUserById,
  updateUser,
  getUserRole,
  changeUserRole,
  moveUserToArchived,
};
