const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dbConfig = require("./app/Config/db.config");
const socketio = require("socket.io");
const WebSockets = require("./Utlis/websockets")


const app = express();
const db = {};
db.mongoose = mongoose;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

var corsOptions = {
  origin: "http://localhost:8081"
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
    httpOnly: true
  })
);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Chat application." });
});

require('./app/Auth/route/auth.routes')(app);
require('./app/User/route/user.routes')(app);
require('./app/Add-friend/routes/request.route')(app);
require('./app/Chats/route/chat.route')(app);



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// create http server
const server = http.createServer(app);
//create socket connection
global.io = socketio(server,{

  cors: {
      origin: "http://localhost:3000"
  }
});
global.io.on('connection',WebSockets.connection);