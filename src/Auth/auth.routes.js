const { verifySignUp } = require("../validators");
const controller = require("./auth.controller");
const emailController = require("../Email-Verification/verifyUserEmail")

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

  app.post("/api/auth/forgot-password", controller.forgotPasswordController);

  app.post("/api/auth/reset-password", controller.resetPasswordController);

  app.post("/api/auth/logout", controller.signOut);

  app.get("/api/auth/verify-email/:confirmationCode", emailController.verifyUser)
};
