const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
    friendList: [],
    confirmationCode: {
      type: String,
    },
    profilePicture: String,
    pendingRequest: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
