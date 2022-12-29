const { authJwt } = require("../../Middlewares");
const controller = require("../controller/search.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/home/search", [authJwt.verifyToken], controller.findUserController);
};
