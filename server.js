const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dbConfig = require("./src/Config/db.config");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("./src/Config/auth.config");
// const WebSockets =require("./src/Socket/Utlis");

// const webSocket = new WebSockets();
const app = express();
const db = {};
db.mongoose = mongoose;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "chat-app_session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
  })
);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Chat application." });
});

require("./src/Auth/auth.routes")(app);
require("./src/User/user.routes")(app);
require("./src/Add-friend/request.route")(app);
require("./src/Chat/chat.route")(app);

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
server.listen(PORT);

const socketio = new Server(server);
global.io = socketio.listen(server);
global.io.use(async (socket, next) => {
  try {
    const token = socket.handshake.headers.authorization;
    if (!token) {
      throw new Error("No token Provided");
    }
    const payload = await jwt.verify(token, config.secret);

    socket.userId = payload.id;

    next();
  } catch (error) {
    console.log(error);
  }
});
const sockets = [];
const activeUsers = new Map();
global.io.on("connection", (socket) => {
  if (activeUsers.has(socket.userId) === false) {
    activeUsers.set(socket.userId,sockets);
    activeUsers.get(socket.userId).push(socket.id);
  } else {
    activeUsers.get(socket.userId).push(socket.id);
  }
  socket.on('disconnect',()=>{
    activeUsers.get(socket.userId).pop(socket.id);
    console.log("user disconnected",'----',socket.id);
  })
});
// global.io.on("connection",webSocket.connection);
// set port, listen for requests
server.on("listening", () => {
  console.log(`Server is running on port ${PORT}.`);
});
