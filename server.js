const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");
const dbConfig = require("./app/Config/db.config");


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
require('./app/Search/route/search.route')(app);
require('./app/Add-friend/routes/request.route')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
