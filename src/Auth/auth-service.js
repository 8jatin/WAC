const config = require("../Config/auth.config");
const crypto = require("crypto");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const {
  sendConfirmationEmail,
  sendEmailToResetPassword,
  sendEmailForResetPasswordSuccess,
} = require("../Config/nodemailer.config");
const { bcrypt_salt} = require("../Config/auth.config");
const { generateOTP } = require("../validators/generateOTP");
const UserRepository = require("../User/user.repository");

const AuthService = class {
  constructor() {
    this.UserRepository = new UserRepository();
  }
  createUser = async ({ username, password, email }) => {
    try {
      const user = await this.UserRepository.create({
        username,
        password,
        email,
      });
      const verification = await sendConfirmationEmail(
        user.username,
        user.email,
        user.confirmationCode
      );
    } catch (err) {
      throw new Error("REGISTRATION ERROR");
    }
  };

  logIn = async ({ username, password }) => {
    try {
      const currentUser = await this.UserRepository.findByUsername(username);

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
      return { loggedUserDetails, token };
    } catch (err) {
      throw new Error("LOGIN ERROR", err);
    }
  };

  forgotPassword = async (email) => {
    try {
      const user = await this.UserRepository.findUserByEmail(email);
      if (!user) {
        res.status(404).send("User does not exist");
      }
      const token = await this.UserRepository.findTokenByUserId(user._id);

      if (token !== null) {
        await this.UserRepository.deleteExistingToken(user._id);
      }
      const otp = await generateOTP();

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(resetToken, Number(bcrypt_salt));

      await this.UserRepository.generateToken(user._id, hash, otp);
      try {
        await sendEmailToResetPassword(user.username, user.email, otp);
      } catch (error) {
        throw new Error(`There is error while sending the email: ${error}`);
      }
    } catch (error) {
      throw new Error("FORGOT PASSWORD ERROR", error);
    }
  };

  resetPassword = async ({ password, otp }) => {
    try {
      const queryToken = await this.UserRepository.findTokenToResetPassword(
        otp
      );

      const user = await this.UserRepository.findUserById(queryToken.userId);

      let passwordResetToken = await this.UserRepository.findTokenByUserId(
        user._id
      );

      if (!queryToken) {
        throw new Error("Invalid or expired password reset token");
      }
      const isValidToken =
        passwordResetToken.token === queryToken.token ? true : false;
      if (!isValidToken) {
        throw new Error("Invalid or expired password reset token");
      }
      const hash = await bcrypt.hashSync(password, 8);
      const result = await this.UserRepository.findAndUpdateUser(
        user._id,
        hash
      );
      const modifiedUser = await this.UserRepository.findUserById(user._id);
      await sendEmailForResetPasswordSuccess(
        modifiedUser.username,
        modifiedUser.email
      );
      await this.UserRepository.deleteExistingToken(passwordResetToken.userId);
    } catch (error) {
      throw new Error("RESET PASSWORD ERROR", error);
    }
  };
};

module.exports = AuthService;
