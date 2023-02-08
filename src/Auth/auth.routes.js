const { verifySignUp } = require("../validators");
const AuthController = require("./auth.controller");
const emailController = require("../Email-Verification/verifyUserEmail");
const multer = require("multer");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  const controller = new AuthController();
  const storage = multer.diskStorage({
    destination: "./public/images", //directory (folder) setting
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname); // file name setting
    },
  });

  //Upload Setting
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/gif"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        cb(new Error("Only jpeg,  jpg , png, and gif Image allow"));
      }
    },
  });

  app.post(
    "/api/auth/register",
    [verifySignUp.checkDuplicateUsernameOrEmail, upload.single("profile_pic")],
    controller.signup
  );

  app.post("/api/auth/login", controller.signIn);

  app.post("/api/auth/forgot-password", controller.forgotPasswordController);

  app.post("/api/auth/reset-password", controller.resetPasswordController);

  app.post("/api/auth/logout", controller.signOut);

  //change the email verification url from nodemailer once you completed the application
  app.get(
    "/api/auth/verify-email/:confirmationCode",
    emailController.verifyUser
  );
};
