const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatName: String,
    userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    chatType: {
      type: String,
      enum: ["Private", "Group"],
      default: "Private",
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    allReadersRead: { type: Boolean, default: false },
    chatInitiator: String,
    unreadCount: Number,
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
