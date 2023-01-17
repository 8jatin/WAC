const { authJwt } = require("../validators");
const controller = require("./request.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/send-request", [authJwt.verifyToken], controller.sendRequestController);
  app.post("/api/accept-request/:requestId", [authJwt.verifyToken], controller.acceptRequestController);

};