const mongoose = require("mongoose");

const unreadMessageCount = new mongoose.Schema(
  {
    receivers: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    unreadCount: Number,
  },
  { timestamps: true }
);

const UnreadChat = mongoose.model("UnreadChat", unreadMessageCount);
module.exports = UnreadChat;
