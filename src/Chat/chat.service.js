const { v4:uuidv4} = require("uuid");
const ChatRepository = require('./chat.repository');

const ChatService = class{
  constructor(){
    this.chatRepository = new ChatRepository();
  }

  startChat = async ({ from, to, type, chatName }) => {
    let users = new Set();
    users.add(from);
    for (let val of to) {
      users.add(val);
    }
    const members = [...users];
    if (type === "Private") {
      const privateChat = await this.chatRepository.findPrivateChat(members, type);
      if (privateChat !== null) {
        return {
          isNew: false,
          _id: privateChat._id,
          userIds: privateChat.userIds,
          chatInitiator: privateChat.chatInitiator,
          chatType: privateChat.chatType,
          chatName: privateChat.chatName,
        };
      }
    }
    const result = await this.chatRepository.createChat(members, type, chatName);
    return {
      isNew: true,
      _id: result._id,
      userIds: result.userIds,
      chatInitiator: result.chatInitiator,
      chatType: result.chatType,
      chatName: result.chatName,
    };
  };

  getChats = async ({ userId, limit, offset }) => {
    const chats = await this.chatRepository.findUserChats(userId, limit, offset);
    return chats;
  };
  
  storeChat = async ({ sender, message, chatId }) => {
    const messageId = uuidv4().replace(/\-/g, "");
    const messageSaved = await this.chatRepository.saveMessage(sender, message ,messageId, chatId);
    return messageSaved;
  };
}

module.exports = ChatService;