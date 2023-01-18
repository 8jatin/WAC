const { authJwt } = require("../validators");
const controller = require("./user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/home/user", [authJwt.verifyToken] ,controller.allAccess);

  app.get("/api/searchUser", [authJwt.verifyToken], controller.searchUserController);

  app.get("/api/users", [authJwt.verifyToken], controller.allUsers);

};