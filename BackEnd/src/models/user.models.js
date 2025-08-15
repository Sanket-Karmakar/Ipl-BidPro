import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  refreshToken: { type: String }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password check method
userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// JWT methods
userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { _id: this._id, email: this.email, fullname: this.fullname, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { _id: this._id, email: this.email, fullname: this.fullname, username: this.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

export const User = mongoose.model("User", userSchema);
