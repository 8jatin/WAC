const {
  createUser,
  logIn,
  logOut,
  resetPassword,
  forgotPassword,
} = require("../auth-service/auth-service");

exports.signup = async (req, res) => {
  try {
    const result = await createUser(req, res);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.signIn = async (req, res) => {
  try {
    await logIn(req, res);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.signOut = async (req, res) => {
  try {
    await logOut(req, res);
  } catch (error) {
    this.next(error);
  }
};

exports.forgotPasswordController = async (req, res) => {
  try {
    await forgotPassword(req,res);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.resetPasswordController = async (req, res) => {
  try {
    const resetPasswordService = await resetPassword(req,res);
  } catch (error) {
    res.status(500).json(error);
  }
};
