const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String, select: false },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
    friendList: [],
    confirmationCode: {
      type: String,
      unique: true,
      select: false,
    },
    pendingRequest: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
