const { findUserBySearchString, showAllUsers } = require("../service/user.service");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content and more of a home page.");
};

exports.searchUserController = async (req, res) => {
  const result = await findUserBySearchString(req, res);
};

exports.allUsers = async (req, res) => {
  const result = await showAllUsers(req, res);
};

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };
