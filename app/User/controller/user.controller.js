const { findUserById } = require("../user-repository/user.repository");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content and more of a home page.");
};

exports.userBoard = async (req, res) => {
  const result = await findUserById(req.userId);
  res.status(200).send(`Welcome to the chat application ${result.username}! `);
};

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };
