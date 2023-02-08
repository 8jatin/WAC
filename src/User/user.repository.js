const config = require("../Config/auth.config");
const User = require("./model/user.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Token = require("./model/token.model");

const UserRepository = class {
  create = async ({ username, password, email , pic}) => {
    const token = jwt.sign({ email: email }, config.secret);

    const user = await User.create({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 8),
      confirmationCode: token,
      profilePicture: pic
    });
    return user;
  };

  findByUsername = async (username) => {
    const user = User.findOne({
      username: username,
    });
    return user;
  };

  getUserBySearchString = async (searchString) => {
    const stringToSearch = `[${searchString}]`;
    const user = User.find({
      $or: [
        { username: { $regex: stringToSearch, $options: "i" } },
        { email: { $regex: stringToSearch, $options: "i" } },
      ],
    })
      .select(
        "-password -confirmationCode -createdAt -updatedAt -pendingRequest"
      )
      .limit(10);
    return user;
  };

  countAllUsers = async () => {
    const users = await User.count({});
    return users;
  };

  getAllUsers = async (limit, offset) => {
    const users = await User.find()
      .select("-password -confirmationCode")
      .lean()
      .skip(offset)
      .limit(limit);
    return users;
  };

  findUserById = async (userId) => {
    return User.findById(userId);
  };

  findUserByEmail = async (email) => {
    return User.findOne({ email });
  };

  generateToken = async (userId, hash, otp) => {
    return Token.create({
      userId: userId,
      token: hash,
      otp: otp,
      createdAt: Date.now(),
    });
  };

  findTokenToResetPassword = async (otp) => {
    return Token.findOne({
      otp: otp,
    });
  };

  findTokenByUserId = async (userId) => {
    const token = await Token.findOne({ userId: userId });
    return token;
  };

  deleteExistingToken = async (userId) => {
    const token = await Token.deleteMany({ userId: userId });
    return token;
  };

  findAndUpdateUser = async (_id, hash) => {
    return User.findOneAndUpdate(
      { _id: _id },
      { $set: { password: hash } },
      { new: true, upsert: true }
    );
  };

  updateStatusAfterConfirmation = async (confirmationCode) => {
    return User.findOneAndUpdate(
      { confirmationCode: confirmationCode },
      { $unset: { confirmationCode: "" } },
      { new: false, upsert: true }
    );
  };

  findAndUpdateUserRequest = async (req) => {
    const user = User.findOneAndUpdate(
      { username: req.body.username },
      { $inc: { pendingRequest: 1 } },
      { new: true, upsert: true }
    );
    return user;
  };

  updateUserFriendList = async (receiverId, senderId) => {
    const user = User.findOneAndUpdate(
      { _id: receiverId },
      { $inc: { pendingRequest: -1 } },
      { $push: { friendList: senderId } },
      { new: true, upsert: true }
    );
    return user;
  };
};

module.exports = UserRepository;
