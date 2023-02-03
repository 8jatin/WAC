const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dbConfig = require("./src/Config/db.config");
const Socket =require("./src/Socket/socket.service");

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

const socketServer = Socket.startServer(app);
//validating socket connection using JWT
// io.use(async (socket, next) => {
//   try {
//     const token = socket.handshake.headers.authorization;
//     console.log(token);
//     if (!token) {
//       throw new Error("No token Provided");
//     }
//     const payload = await jwt.verify(token, config.secret);
//     console.log(payload.id);
//     socket.userId = payload.id;

//     next();
//   } catch (error) {
//     console.log(error);
//   }
// });
// io.on("connection",Socket.connection);

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
