const ChatService = require("./chat.service");

const ChatController = class {
  constructor() {
    this.chatService = new ChatService();
  }
  getAllChats = async (req, res) => {
    try {
      const payload = {
        limit: req.query.limit,
        offset: req.query.limit,
        userId: req.userId,
      };
      const result = await this.chatService.getChats(payload);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  initiateChat = async (req, res) => {
    try {
      const payload = {
        from: req.userId,
        to: req.body.userIds,
        type: req.query.type,
        chatName: req.body.chatName,
      };
      const initiate = await this.chatService.startChat(payload);
      res.status(200).send(initiate);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  sendMessage = async (req, res) => {
    try {
      const payload = {
        message: req.body.message,
        sender: req.userId,
        chatId: req.params.id,
      };
      const result = await this.chatService.storeMessage(payload);
      // global.io.sockets.in(chatId).emit("new message",{message:result})
      res.status(201).send(result);
    } catch (error) {
      res.status(401).send(`Unauthorized access`);
    }
  };

  selectChat = async (req, res) => {
    try {
      const payload = {
        userId: req.userId,
        chatId: req.params.id,
        limit: req.query.limit,
        offset: req.query.offset,
      };
      const result = await this.chatService.selectedChat(payload);
      res.status(200).send(result);
    } catch (error) {
      res.status(401).send("Unauthorized access");
    }
  };

  deleteChat = async (req, res) => {
    try {
      const payload = {
        userId:req.userId,
        chatId:req.params.id
      }
      const result = await this.chatService.deleteChat(payload);
      res.status(200).send("Your chat has been deleted successfully");
    } catch (error) {
      res.status(500).send("We are unable to delete your chat at this moment");
    }
  };

  markAllConversationRead = async (req, res) => {};
};

module.exports = ChatController;
