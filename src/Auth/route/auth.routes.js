const { verifySignUp } = require("../../Middlewares");
const controller = require("../controller/auth.controller");
const emailController = require("../../Email-Verification/verifyUser")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/register",
    [
      verifySignUp.checkDuplicateUsernameOrEmail
    ],
    controller.signup
  );

  app.post("/api/auth/login", controller.signIn);

  app.post("/api/auth/forgotPassword", controller.forgotPasswordController);

  app.post("/api/auth/reset-password", controller.resetPasswordController);

  app.post("/api/auth/logout", controller.signOut);

  app.get("/api/auth/verifyEmail/:confirmationCode", emailController.verifyUser)
};
