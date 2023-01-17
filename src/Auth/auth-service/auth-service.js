const config = require("../../Config/auth.config");
const crypto = require("crypto");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const {
  create,
  findByUsername,
  findUserByEmail,
  findTokenByUserId,
  findAndUpdateUser,
  findUserById,
  deleteExistingToken,
  generateToken,
  findTokenToResetPassword,
} = require("../../User/user-repository/user.repository");
const {
  sendConfirmationEmail,
  sendEmailToResetPassword,
  sendEmailForResetPasswordSuccess,
} = require("../../Config/nodemailer.config");
const Token = require("../../User/model/token.model");
const { bcrypt_salt } = require("../../Config/auth.config");
const { generateOTP } = require("../../Middlewares/generateOTP");

exports.createUser = async (req, res) => {
  const user = await create(req);
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    res.status(201).send({
      message:
        "User was registered successfully!, Check your email to confirm the registration",
    });

    sendConfirmationEmail(user.username, user.email, user.confirmationCode);
  });
};

exports.logIn = async (req, res) => {
  try {
    const currentUser = await findByUsername(req);

    if (!currentUser) {
      return res.status(404).send({ message: "User Not found." });
    }

    if (currentUser.status != "Active") {
      return res.status(401).send({
        message: "Pending Account. Please Verify Your Email!",
      });
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      currentUser.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    var token = jwt.sign({ id: currentUser.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    req.session.token = token;

    res.status(200).send({
      id: currentUser._id,
      username: currentUser.username,
      email: currentUser.email,
      status: currentUser.status,
      requestsPending: currentUser.pendingRequest,
      friends: currentUser.friendList,
    });
  } catch (err) {
    console.log("Login error", err);
  }
};

exports.logOut = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await findUserByEmail(req.body.email);
    if (!user) {
      res.status(404).send("User does not exist");
    }
    const token = await findTokenByUserId(user._id);

    if (token !== null) {
      await deleteExistingToken(user._id);
    }
    const otp = await generateOTP();

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcrypt_salt));

    await generateToken(user._id, hash, otp);
    try {
      await sendEmailToResetPassword(user.username, user.email, otp);
      res.send("Password reset link send to the given email");
    } catch (error) {
      res.status(500).send("There is error while sending the email");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const queryToken = await findTokenToResetPassword(req.body.otp);

    const user = await findUserById(queryToken.userId);
    console.log(user);

    let passwordResetToken = await findTokenByUserId(user._id);

    if (!queryToken) {
      throw new Error("Invalid or expired password reset token");
    }
    const isValidToken =
      passwordResetToken.token === queryToken.token ? true : false;
    if (!isValidToken) {
      throw new Error("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hashSync(req.body.password, 8);
    const result = await findAndUpdateUser(user._id, hash);
    console.log(result);
    const modifiedUser = await findUserById(user._id);
    await sendEmailForResetPasswordSuccess(
      modifiedUser.username,
      modifiedUser.email
    );
    await deleteExistingToken(passwordResetToken.userId);
    res
      .status(200)
      .send("Password was changed successfully please login with new password");
  } catch (error) {
    console.log("--------------------", error);
    res.status(500).send("We are unable to change your password at the moment");
  }
};
