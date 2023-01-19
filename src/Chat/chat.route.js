const { authJwt } = require("../validators");
const controller = require("./chat.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  //list of all chat available to user route (it'll take limit and offset as query param)
  app.get("/chats", [authJwt.verifyToken] ,controller.getAllChats);

  //route to select a chat or join a chat (it'll take id of chat as path param and also contain all the messages previously present in chat also there will be limit and offset for messages to be shown)
  app.get("/chats/:id/messages/", [authJwt.verifyToken] ,controller.selectChat);

  //route to initiate a chat with another user if they haven't chat yet (it'll take chat type as query param)
  app.post("/chats/initiate-chat", [authJwt.verifyToken], controller.initiateChat);

  //route to send a message in particular chat (it'll take chat id as path param)
  app.post("/chats/:id/messages/send-message", [authJwt.verifyToken], controller.sendMessage);

  //route to delete a chat for user (it'll take chat id as path param)
  app.put("/chats/delete-chat/:id", [authJwt.verifyToken], controller.deleteChat);

  //route to mark all the chat as read in one go (it'll take chat id as path param)
  app.put("/chats/:id/mark-all-read", [authJwt.verifyToken], controller.markAllConversationRead);

};