const config = require("../Config/auth.config");
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
} = require("../User/user.repository");
const {
  sendConfirmationEmail,
  sendEmailToResetPassword,
  sendEmailForResetPasswordSuccess,
} = require("../Config/nodemailer.config");
const { bcrypt_salt, pass } = require("../Config/auth.config");
const { generateOTP } = require("../validators/generateOTP");

exports.createUser = async ({ username, password, email }) => {
  try {
    const user = await create({ username, password, email });
    const verification = await sendConfirmationEmail(
      user.username,
      user.email,
      user.confirmationCode
    );
  } catch (err) {
    throw new Error("REGISTRATION ERROR");
  }
};

exports.logIn = async ({ username, password }) => {
  try {
    const currentUser = await findByUsername(username);

    if (!currentUser) {
      throw new Error(`User not found`);
    }

    if (currentUser.status != "Active") {
      throw new Error(
        `User account is in ${currentUser.status} state , please verify your account on ${currentUser.email}`
      );
    }

    var passwordIsValid = bcrypt.compareSync(password, currentUser.password);

    if (!passwordIsValid) {
      throw new Error("INVALID PASSWORD!");
    }

    var token = jwt.sign({ id: currentUser.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    const loggedUserDetails = {
      id: currentUser._id,
      username: currentUser.username,
      email: currentUser.email,
      status: currentUser.status,
      requestsPending: currentUser.pendingRequest,
      friends: currentUser.friendList,
    };
    return {loggedUserDetails,token};
  } catch (err) {
    console.log("Login error", err);
  }
};

exports.forgotPassword = async (email) => {
  try {
    const user = await findUserByEmail(email);
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
    } catch (error) {
      throw new Error(`There is error while sending the email: ${error}`);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.resetPassword = async ({password,otp}) => {
  try {
    const queryToken = await findTokenToResetPassword(otp);

    const user = await findUserById(queryToken.userId);

    let passwordResetToken = await findTokenByUserId(user._id);

    if (!queryToken) {
      throw new Error("Invalid or expired password reset token");
    }
    const isValidToken =
      passwordResetToken.token === queryToken.token ? true : false;
    if (!isValidToken) {
      throw new Error("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hashSync(password, 8);
    const result = await findAndUpdateUser(user._id, hash);
    const modifiedUser = await findUserById(user._id);
    await sendEmailForResetPasswordSuccess(
      modifiedUser.username,
      modifiedUser.email
    );
    await deleteExistingToken(passwordResetToken.userId);
  } catch (error) {
    console.log("--------------------", error);
    res.status(500).send("We are unable to change your password at the moment");
  }
};
