const { v4: uuidv4 } = require("uuid");
const ChatRepository = require("./chat.repository");

const ChatService = class {
  constructor() {
    this.chatRepository = new ChatRepository();
  }

  startChat = async ({ from, to, type, chatName }) => {
    //using a set of users so that no duplicate users can exist in one chat
    let users = new Set();
    users.add(from);
    for (let val of to) {
      users.add(val);
    }
    const members = [...users];
    if (type === "Private") {
      //finding private chat between two users
      const privateChat = await this.chatRepository.findPrivateChat(
        members,
        type
      );
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
    //two users can create as many group chats as they can 
    const result = await this.chatRepository.createChat(
      members,
      type,
      chatName
    );
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
    const chats = await this.chatRepository.findUserChats(
      userId,
      limit,
      offset
    );
    return chats;
  };

  storeMessage = async ({ sender, message, chatId }) => {
    //generate the unique uuid for a message 
    const messageId = uuidv4().replace(/\-/g, "");
    //save messages in database , so they can be showed if one of user is offline
    const messageSaved = await this.chatRepository.saveMessage(
      sender,
      message,
      messageId,
      chatId
    );
    await this.chatRepository.increaseChatUnreadCount(chatId);
    return messageSaved;
  };

  selectedChat = async ({ userId, chatId, limit, offset }) => {
    let receivers = new Set();
    let flag = true;
    const chat = await this.chatRepository.getChatById(chatId);
    //find the last message from chat with its chatId
    const lastMessage = await this.chatRepository.getLastMessageFromChat(
      chatId
    );
    //find list of users who have access to that chat
    for (let i = 0; i < chat.userIds.length; i++) {
      //check if current user is in the list of user who have access or not
      if (userId === chat.userIds[i]) {
        //check if current user has already the messages
        const userRead = lastMessage[0].readers.some(
          (el) => el.userId === userId
        );
        if (!userRead) {
          //update the recent messages of a particular chat - adding reader details
          await this.chatRepository.updateRecentMessages(
            userId,
            chat._id,
            lastMessage[0].messageId
          );
        }
      }
    }
    receivers.add(lastMessage[0].sender);
    receivers.add(userId);
    for (let val of chat.userIds) {
      //check if all the readers had read the message or not in chat
      if (!receivers.has(val)) {
        //even if a single user is left to read break out of this loop
        flag = false;
        break;
      }
    }
    //if all the readers read then update the chat allReadersRead key and update the unreadCount of chat
    if (flag == true) {
      await this.chatRepository.updateUnreadCount(chatId);
      await this.chatRepository.updateAllMessageStatus(chatId);
    }
    //list all the recent messages in chat according to their timestamps
    const messages = await this.chatRepository.getMessagesByChatId(
      chatId,
      offset,
      limit
    );
    return messages;
  };
};

module.exports = ChatService;
