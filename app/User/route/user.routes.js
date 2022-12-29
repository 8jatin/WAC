const { authJwt } = require("../../Middlewares");
const controller = require("../controller/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/home", controller.allAccess);

  app.get("/api/home/user", [authJwt.verifyToken], controller.userBoard);

};
