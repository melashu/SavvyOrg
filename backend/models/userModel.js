const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "customer",
    },
    isConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    avatar: {
      type: String,
      required: true,
    },
    // New Fields Added
    bio: {
      type: String,
      maxlength: 500, // Optional character limit for the bio
    },
    profilePic: {
      type: String, // URL to the user's profile picture
    },
    socialLinks: {
      facebook: { type: String }, // URL to Facebook profile
      linkedin: { type: String }, // URL to LinkedIn profile
      twitter: { type: String }, // URL to Twitter profile
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// function to check of passwords are matching
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// encrypt password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
