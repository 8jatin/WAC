const {
  createUser,
  logIn,
  logOut,
  resetPassword,
  forgotPassword,
} = require("./auth-service.js");

exports.signup = async (req, res) => {
  try {
    const payload = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    };
    const result = await createUser(payload);
    res
      .status(201)
      .send(
        `User account has been created check ${payload.email} for verification`
      );
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.signIn = async (req, res) => {
  try {
    const payload = {
      username: req.body.username,
      password: req.body.password,
    };
    const user = await logIn(payload);
    req.session.token = user.token;
    res.status(200).send(user.loggedUserDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.signOut = async (req, res) => {
  try {
    req.session = null
    res.status(200).send(`You have been logged out successfully`);
  } catch (error) {
    this.next(error);
  }
};

exports.forgotPasswordController = async (req, res) => {
  try {
    await forgotPassword(req.body.email);
    res.status(200).send(`Reset password link generated on ${req.body.email}!`);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.resetPasswordController = async (req, res) => {
  try {
    const payload = {
      password: req.body.password,
      otp : req.body.otp
    }
    const resetPasswordService = await resetPassword(payload);
    res.status(201).send(`User password has been changed successfully`);
  } catch (error) {
    res.status(500).json(error);
  }
};
