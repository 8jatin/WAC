const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatName: String,
    userIds: [],
    chatType: {
      type: String,
      enum: ["Private", "Group"],
      default: "Private",
    },
    chatInitiator: String,
    unreadCount: Number,
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
