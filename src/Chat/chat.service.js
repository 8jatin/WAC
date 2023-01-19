const { createChat, findPrivateChat, saveMessage, MessageSentInChat } = require("./chat.repository");
const { v4:uuidv4} = require("uuid");

exports.startChat = async ({ from, to, type, chatName }) => {
  let users = new Set();
  users.add(from);
  for (let val of to) {
    users.add(val);
  }
  const members = [...users];
  if (type === "Private") {
    const privateChat = await findPrivateChat(members, type);
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
  const result = await createChat(members, type, chatName);
  return {
    isNew: true,
    _id: result._id,
    userIds: result.userIds,
    chatInitiator: result.chatInitiator,
    chatType: result.chatType,
    chatName: result.chatName,
  };
};

exports.getChats = async ({ userId, limit, offset }) => {
  const chats = await findUserChats(userId, limit, offset);
  return chats;
};

exports.sendMessageInChat = async ({ sender, message, chatId }) => {
  const messageId = uuidv4().replace(/\-/g, "");
  const messageSaved = await saveMessage(sender, message ,messageId, chatId);
  const chatMessage = await MessageSentInChat(
    messageSaved._id,
    sender,
    message,
    messageSaved.chatId
  );
  console.log('--------CHAT MESSAGE--------',chatMessage);
  return chatMessage;
};
