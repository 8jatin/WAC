const config = require("../../Config/auth.config");
const User = require("../model/user.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Token = require("../model/token.model");
const { user } = require("../../Config/auth.config");

exports.create = async (req) => {
  const token = jwt.sign({ email: req.body.email }, config.secret);

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirmationCode: token,
  });
  return user;
};

exports.findByUsername = async (req) => {
  const user = User.findOne({
    username: req.body.username,
  });
  return user;
};

exports.getUserByUsernameOrEmail = async (req) => {
  const searchString = `[${req.query.searchString}]`;
  const user = User.find({
    $or: [
      { username: { $regex: searchString, $options: "i" } },
      { email: { $regex: searchString, $options: "i" } },
    ],
  })
    .select("-password -confirmationCode")
    .limit(10);
  return user;
};

exports.countAllUsers = async ()=>{
  const users =  await User.count({});
  return users;
}

exports.getAllUsers = async (limit, offset) => {
  const users = await User.find()
    .select("-password -confirmationCode")
    .skip(offset)
    .limit(limit);
  return users;
};

exports.findUserById = async (userId) => {
  return User.findById(userId);
};

exports.findUserByEmail = async (email) => {
  return User.findOne({ email });
};

exports.generateToken = async (userId, hash, otp) => {
  return Token.create({
    userId: userId,
    token: hash,
    otp: otp,
    createdAt: Date.now(),
  });
};

exports.findTokenToResetPassword = async (otp) => {
  return Token.findOne({
    otp: otp,
  });
};

exports.findTokenByUserId = async (userId) => {
  const token = await Token.findOne({ userId: userId });
  return token;
};

exports.deleteExistingToken = async (userId) => {
  const token = await Token.deleteMany({ userId: userId });
  return token;
};

exports.findAndUpdateUser = async (_id, hash) => {
  return User.findOneAndUpdate(
    { _id: _id },
    { $set: { password: hash } },
    { new: true, upsert: true }
  );
};

exports.updateStatusAfterConfirmation = async (req) => {
  return User.findOneAndUpdate(
    { confirmationCode: req.params.confirmationCode },
    { $unset: { confirmationCode: "" } },
    { new: true, upsert: true }
  );
};

exports.findAndUpdateUserRequest = async (req) => {
  const user = User.findOneAndUpdate(
    { username: req.body.username },
    { $inc: { pendingRequest: 1 } },
    { new: true, upsert: true }
  );
  return user;
};

exports.updateUserFriendList = async (receiverId, senderId) => {
  const user = User.findOneAndUpdate(
    { _id: receiverId },
    { $inc: { pendingRequest: -1 } },
    { $push: { friendList: senderId } },
    { new: true, upsert: true }
  );
  return user;
};
