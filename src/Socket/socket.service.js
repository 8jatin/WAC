const socketIo = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");
const config = require("../Config/auth.config");

var activeUsers = new Map();
class SocketService {
  startServer(app) {
    const server = http.createServer();
    server.listen(3000);
    const socketIoServer = socketIo(server);
    const io = socketIoServer.listen(server);
    console.log("-----------socket server starts before app server-----------");
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.headers.authorization;
        console.log(token);
        if (!token) {
          throw new Error("No token Provided");
        }
        const payload = await jwt.verify(token, config.secret);
        console.log(payload.id);
        socket.userId = payload.id;

        next();
      } catch (error) {
        console.log(error);
      }
    });

    app.set("io",io);
  }
  sendMessage({ messageId, chatId, sender, targetUsers }) {}
  // connection = (socket) => {
  //   if (activeUsers.has(socket.userId)) {
  //     activeUsers.get(socket.userId).push(socket.id);
  //   } else {
  //     activeUsers.set(socket.userId, [socket.id]);
  //   }
  //   console.log(activeUsers);
  //   socket.on("disconnect", () => {
  //     const index = activeUsers.get(socket.userId).indexOf(socket.id);
  //     activeUsers.get(socket.userId).splice(index, 1);
  //     console.log("user disconnected", "----", socket.id);
  //   });
  //   socket.on("message-received", ({ chatId, sender, message }) => {});
  // };
}

module.exports = new SocketService();
