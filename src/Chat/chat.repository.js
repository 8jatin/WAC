const { findUserById } = require("../User/user.repository");
const Chat = require("./models/chat.model");
const Message = require("./models/message.model");

exports.createChat = async (users, type, chatName) => {
  const sender = await findUserById(users[0]);
  return Chat.create({
    chatName: chatName,
    chatType: type,
    chatInitiator: sender.username,
    userIds: users,
    unreadCount: 0,
  });
};

exports.findPrivateChat = async (members, type) => {
  const chat = Chat.findOne({
    userIds: [...members],
    type,
  });
  return chat;
};

exports.findUserChats = async (userId, limit, offset) => {};

exports.saveMessage = async (sender, message, messageId, chatId) => {
  const savedMessage = new Message({
    message: message,
    sender: sender,
    chatId: chatId,
    readers: [{ messageId: messageId, userIds: sender }],
  });
  savedMessage.save((err) => {
    if (err) {
      console.log(err);
    }
  });
  return savedMessage;
};

exports.MessageSentInChat = async (messageId, sender, message, chatId) => {
  const updatedChat = Message.aggregate([
    { $match: { _id: messageId } },
    {
      $lookup: {
        from: "Chat",
        localField: chatId,
        foreignField: _id,
        as: "chatInfo",
      },
    },
    { $unwind: chatId },
    {
      $group: {
        _id: "$chatInfo._id",
        message: "$message",
      },
    },
  ]);
  return updatedChat;
};
