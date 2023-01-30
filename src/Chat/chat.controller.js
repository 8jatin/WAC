const ChatService = require("./chat.service");
const Socket = require("../Socket/socket.service")

class ChatController {
  constructor() {
    this.chatService = new ChatService();
    this.webSockets =  Socket;
  }
  getAllChats = async (req, res) => {
    try {
      const payload = {
        limit: req.query.limit,
        offset: req.query.limit,
        userId: req.userId,
      };
      const result = await this.chatService.getChats(payload);
      console.log(result);
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
  messageController = async (req, res) => {
    if(!req.body.message){
      res.send("Message not provided");
    }
    try {
      const payload = {
        message: req.body.message,
        sender: req.userId,
        chatId: req.params.id,
      };
      const message = await this.chatService.storeMessage(payload);
      const messagePayload = {
        messageId:message.messageId,
        sender:message.sender,
        chatId:message.chatId
      }
      const result = await this.chatService.sentMessage(messagePayload);
      const users = result.targetUsers;
      const io = await req.app.get("io");
      console.log(io);
      users.forEach((el)=>{
        io.socket.to(el).emit("message-received",result.message);
      });
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
      if(result===undefined){
        res.send("No Messages to read in this chat");
      }
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
