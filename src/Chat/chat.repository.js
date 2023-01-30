const UserRepository = require("../User/user.repository");
const Chat = require("./models/chat.model");
const Message = require("./models/message.model");
const UnreadChat = require("./models/unreadMessageCount.model");

class ChatRepository {
  constructor() {
    this.UserRepository = new UserRepository();
  }

  createChat = async (users, type, chatName) => {
    const sender = await this.UserRepository.findUserById(users[0]);
    const chat = Chat.create({
      chatName: chatName,
      chatType: type,
      chatInitiator: sender.username,
      userIds: users,
      participants: users,
      unreadCount: 0,
    });
    return chat;
  };

  increaseChatUnreadCount = async (chatId) => {
    return Chat.findOneAndUpdate(
      { _id: chatId },
      { $inc: { unreadCount: 1 } },
      { new: true, upsert: true }
    );
  };

  updateUnreadCount = async (chatId) => {
    return Chat.findOneAndUpdate({ _id: chatId }, { $set: { unreadCount: 0 } });
  };

  updateAllMessageStatus = async (chatId) => {
    return Chat.findOneAndUpdate(
      { _id: chatId },
      { $set: { allReadersRead: true } },
      { new: true, upsert: true }
    );
  };

  addChatParticipants = async (chatId, users) => {
    return Chat.findOneAndUpdate(
      { _id: chatId },
      { $set: { allReadersRead: false, participants: users } },
      { new: true, upsert: true }
    );
  };

  removeParticipantFromChat = async (userId, chatId) => {
    return Chat.findOneAndUpdate(
      { _id: chatId },
      { $pull: { participants: userId } },
      { new: true, upsert: true }
    );
  };

  findPrivateChat = async (members, type) => {
    const chat = Chat.findOne({
      userIds: { $all: members },
      type,
    }).populate("userIds", "username email");
    return chat;
  };

  findUserChats = async (userId, limit, offset) => {
    const chats = Chat.find({
      participants: userId,
    })
      .populate("userIds", "username")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(offset);

    return chats;
  };

  saveMessage = async (sender, message, messageId, chatId) => {
    const savedMessage = new Message({
      message: message,
      sender: sender,
      chatId: chatId,
      messageId: messageId,
      readers: [{ messageId: messageId, userId: sender, isRead: true }],
    });
    savedMessage.save((err) => {
      if (err) {
        console.log(err);
      }
    });
    return savedMessage;
  };

  createUnreadChat = async (chatId, userId) => {
    return UnreadChat.create({
      chatId: chatId,
      receivers: userId,
      unreadCount: 1,
    });
  };

  updateUnreadChatCount = async (chatId, userId) => {
    return UnreadChat.findOneAndUpdate(
      {
        chatId: chatId,
        receivers: userId,
      },
      { $inc: { unreadCount: 1 } },
      {
        new: true,
        upsert: true,
      }
    );
  };

  updateUnreadChatSeenMessageCount = async (chatId, userId) => {
    return UnreadChat.findOneAndUpdate(
      { chatId: chatId, receivers: userId },
      { $set: { unreadCount: 0 } },
      { new: true, upsert: true }
    );
  };

  getChatById = async (chatId) => {
    return Chat.findOne({ _id: chatId });
  };

  getLastMessageFromChat = async (chatId) => {
    return Message.find({ chatId: chatId }).sort({ createdAt: -1 }).limit(1);
  };

  updateRecentMessages = async (userId, chatId) => {
    const updateMessage = Message.updateMany(
      {
        chatId: chatId,
      },
      {
        $addToSet: {
          readers: [{ userId: userId, isRead: true }],
        },
      },
      { new: true, multi: true }
    );
    return updateMessage;
  };

  getMessagesByChatId = async (chatId, offset, limit) => {
    return Message.find({ chatId: chatId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
  };
  getMessageByUUID = async (messageId) => {
    return Message.findOne({ messageId: messageId });
  };
}
module.exports = ChatRepository;
