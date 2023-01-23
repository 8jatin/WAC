const AuthService = require("./auth-service.js");

const AuthController = class {
  constructor() {
    this.AuthService = new AuthService();
  }
  signup = async (req, res) => {
    try {
      const payload = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
      };
      const result = await this.AuthService.createUser(payload);
      res
        .status(201)
        .send(
          `User account has been created check ${payload.email} for verification`
        );
    } catch (error) {
      res.status(500).json(error);
    }
  };

  signIn = async (req, res) => {
    try {
      const payload = {
        username: req.body.username,
        password: req.body.password,
      };
      const user = await this.AuthService.logIn(payload);
      req.session.token = user.token;
      res.status(200).send(user.loggedUserDetails);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  signOut = async (req, res) => {
    try {
      req.session = null;
      res.status(200).send(`You have been logged out successfully`);
    } catch (error) {
      this.next(error);
    }
  };

  forgotPasswordController = async (req, res) => {
    try {
      await this.AuthService.forgotPassword(req.body.email);
      res
        .status(200)
        .send(`Reset password link generated on ${req.body.email}!`);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  resetPasswordController = async (req, res) => {
    try {
      const payload = {
        password: req.body.password,
        otp: req.body.otp,
      };
      const resetPasswordService = await this.AuthService.resetPassword(
        payload
      );
      res.status(201).send(`User password has been changed successfully`);
    } catch (error) {
      res.status(500).json(error);
    }
  };
};

module.exports = AuthController;
