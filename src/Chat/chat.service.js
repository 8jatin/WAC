const { v4: uuidv4 } = require("uuid");
const ChatRepository = require("./chat.repository");

class ChatService {
  constructor() {
    this.chatRepository = new ChatRepository();
  }

  startChat = async ({ from, to, type, chatName }) => {
    //using a set of users so that no duplicate users can exist in one chat
    const users = new Set();
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
      if (privateChat) {
        await this.chatRepository.addChatParticipants(privateChat._id, members);
        return {
          isNew: false,
          privateChat,
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
    try {
      const chats = await this.chatRepository.findUserChats(
        userId,
        limit,
        offset
      );
      return chats;
    } catch (error) {
      throw new Error(error);
    }
  };

  storeMessage = async ({ sender, message, chatId }) => {
    const findChat = await this.chatRepository.getChatById(chatId);
    const verify = findChat.userIds.includes(sender);
    const receivers = findChat.userIds.filter((el) => el != sender);
    const lastMessage = await this.chatRepository.getLastMessageFromChat(
      chatId
    );
    if (lastMessage.length === 0) {
      receivers.forEach(async (userId) => {
        await this.chatRepository.createUnreadChat(chatId, userId);
      });
    } else {
      receivers.forEach(async (userId) => {
        await this.chatRepository.updateUnreadChatCount(chatId, userId);
      });
    }
    if (!verify) {
      return;
    }
    const addParticipant = await this.chatRepository.addChatParticipants(
      chatId,
      findChat.userIds
    );
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
    const options = {
      userId: userId,
      chatId: chatId,
    };
    await this.markAllChatRead(options);
    const chat = await this.chatRepository.getChatById(chatId);

    if (chat.chatDeleteTime.length !== 0) {
      for (let i = 0; i < chat.chatDeleteTime.length; i++) {
        if (chat.chatDeleteTime[i].userId == userId) {
          const messages =
            await this.chatRepository.getMessagesAfterChatDeletion(
              chatId,
              chat.chatDeleteTime[i].deletionTime,
              offset,
              limit
            );
          return messages;
        }
      }
    }
    //list all the recent messages in chat according to their timestamps
    const messages = await this.chatRepository.getMessagesByChatId(
      chatId,
      offset,
      limit
    );
    return messages;
  };

  deleteChat = async ({ userId, chatId }) => {
    const chat = await this.chatRepository.getChatById(chatId);
    if(chat.chatDeleteTime.length!==0){
    for(let i = 0; i<chat.chatDeleteTime.length;i++){
      if(chat.chatDeleteTime[i].userId==userId){
        const result = await this.chatRepository.updateDeletionTime(chatId,userId);
        return result;
      }
    }
  }
    const removeParticipant =
      await this.chatRepository.removeParticipantFromChat(userId, chatId);
    return removeParticipant;
  };

  sentMessage = async ({ messageId, sender, chatId }) => {
    const targetUsers = [];
    const chat = await this.chatRepository.getChatById(chatId);
    chat.userIds.forEach((userId) => {
      if (userId != sender) {
        targetUsers.push(userId);
      }
    });
    const message = await this.chatRepository.getMessageByUUID(messageId);
    const result = {
      targetUsers: targetUsers,
      message: message,
    };
    return result;
  };
  markAllChatRead = async ({ userId, chatId }) => {
    let receivers = new Set();
    let flag = true;
    const chat = await this.chatRepository.getChatById(chatId);
    const verify = chat.userIds.includes(userId);
    if (!verify) {
      throw new Error("Unauthorized");
    }
    //find the last message from chat with its chatId
    const lastMessage = await this.chatRepository.getLastMessageFromChat(
      chatId
    );
    if (lastMessage.length === 0) {
      return;
    }
    //find list of users who have access to that chat
    for (let i = 0; i < chat.userIds.length; i++) {
      //check if current user is in the list of user who have access or not
      if (userId == chat.userIds[i]) {
        //check if current user has already the messages
        const userRead = lastMessage[0].readers.some(
          (el) => el.userId === userId
        );
        if (userRead === false) {
          //update the recent messages of a particular chat - adding reader details
          await this.chatRepository.updateRecentMessages(userId, chat._id);
        }
      }
    }
    receivers.add(lastMessage[0].sender);
    receivers.add(userId);
    for (let val of chat.userIds) {
      //check if all the readers had read the message or not in chat
      if (receivers.has(val.toString()) == false) {
        //even if a single user is left to read break out of this loop
        flag = false;
        break;
      }
    }
    const unreadChatCount =
      await this.chatRepository.updateUnreadChatSeenMessageCount(
        chatId,
        userId
      );

    //if all the readers read then update the chat allReadersRead key and update the unreadCount of chat
    if (flag == true) {
      await this.chatRepository.updateUnreadCount(chatId, userId);
      await this.chatRepository.updateAllMessageStatus(chatId);
    }
    //list all the recent messages in chat according to their timestamps
    const updatedChat = await this.chatRepository.getChatById(chatId);
    return updatedChat;
  };
}

module.exports = ChatService;
