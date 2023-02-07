const socketIo = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");
const config = require("../Config/auth.config");
const server = http.createServer();
server.listen(3000);
const socketIoServer = socketIo(server);
const activeUsers = new Map();
class SocketService {
  constructor() {
    this.io = socketIoServer.listen(server);

  }
  startServer() {
    this.io.on("connection", async (socket) => {
      const verifyUser = await this.authenticateConnection(socket);
      if (verifyUser === undefined) {
        socket.disconnect();
        return;
      }
      await this.userRegistry(socket);
      socket.on("disconnect", async () => {
        await this.removeUserFromRegistry(socket);
        console.log('-----USER REGISTRY AFTER DISCONNECTION-----',activeUsers);
      });
    });
  }

  authenticateConnection = async (socket) => {
    try {
      const token = socket.handshake.headers.authorization;
      if (!token) {
        socket.disconnect();
      }
      const payload = await jwt.verify(token, config.secret);
      if (!payload) {
        socket.disconnect();
      }
      socket.userId = payload.id;
      return socket.userId;
    } catch (error) {
      socket.disconnect();
    }
  };

  userRegistry(socket) {
    //find if active users dictionary has that key
    if (activeUsers.has(socket.userId)) {
      //push the current socket id in pre existing key
      activeUsers.get(socket.userId).push(socket.id);
    } else {
      //create a key of userId with its respective socket id if it doesn't exist in dictionary
      activeUsers.set(socket.userId, [socket.id]);
    }
    console.log('-----ACTIVE USERS------',activeUsers);
  }

  sendMessage({ targetUsers, chatId, message, sender }){
    //emit to receivers
    targetUsers.forEach(async (userId) => {
      const userSockets = activeUsers.get(userId.toString());
      if (userSockets) {
        userSockets.forEach((socketId) => {
          this.io.to(socketId).emit("message-received", message);
        });
      } else {
      }
    });
    //emit to self (if using multiple socket connection) (duplicate message exist here as sender is receiving twice)
    const senderSocketConnections = activeUsers.get(sender);
    console.log(senderSocketConnections);
    senderSocketConnections.forEach((socketId) => {
      // if (socketId != socket.id) {
        this.io.to(socketId).emit("message-received", message);
      // }
    });
  }

  removeUserFromRegistry(socket) {
    //find index of socket id which was disconnected from users dictionary
    const index = activeUsers.get(socket.userId).indexOf(socket.id);

    //remove the socket id from users dictionary according to its index
    activeUsers.get(socket.userId).splice(index, 1);

    //remove empty key from dictionary of users
    if (activeUsers.get(socket.userId).length === 0) {
      activeUsers.delete(socket.userId);
    }
    console.log("user disconnected", "----", socket.id);
  }
}

module.exports = new SocketService();
