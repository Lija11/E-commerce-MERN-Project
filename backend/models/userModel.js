const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
    maxLength: [30, "Name can't exceed 30 characters "],
    minLength: [4, "Name Should Have More Than 4 characters "],
  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: true,
    validator: [validator.isEmail, "Please Enter A Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your Password"],
    minLength: [8, "Password Should be greater Than 8 characters "],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// userSchema.pre("save", async function (next) {
//   this.password = await bcrypt.hash(this.password, 10);
//   if (!this.isModified("password")) {
//     next();
//   }
// });

userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  if (!this.isModified("password")) {
    next();
  }
});

// JWT
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
