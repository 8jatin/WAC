const ChatService = require("./chat.service");

const ChatController = class{
    constructor(){
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
          console.log(initiate);
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
          const result = await this.chatService.storeChat(payload);
          res.status(201).send(result);
        } catch (error) {
          res.status(500).send(`Message can't be delivered at the moment`);
        }
      };
      
      selectChat = async (req, res) => {};
      
      deleteChat = async (req, res) => {};
      
      markAllConversationRead = async (req, res) => {};
}

module.exports = ChatController;
