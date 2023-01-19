const { findUserById } = require("../User/user.repository");
const Chat = require("./models/chat.model");
const Message = require("./models/message.model");

const ChatRepository = class {
  createChat = async (users, type, chatName) => {
    const sender = await findUserById(users[0]);
    return Chat.create({
      chatName: chatName,
      chatType: type,
      chatInitiator: sender.username,
      userIds: users,
      unreadCount: 0,
    });
  };

  findPrivateChat = async (members, type) => {
    const chat = Chat.findOne({
      userIds: [...members],
      type,
    });
    return chat;
  };

  findUserChats = async (userId, limit, offset) => {};

  saveMessage = async (sender, message, messageId, chatId) => {
    const savedMessage = new Message({
      message: message,
      sender: sender,
      chatId: chatId,
      messageId: messageId,
      readers: [{ messageId: messageId, userIds: [sender] }],
    });
    savedMessage.save((err) => {
      if (err) {
        console.log(err);
      }
    });
    return savedMessage;
  };
};
module.exports = ChatRepository;
