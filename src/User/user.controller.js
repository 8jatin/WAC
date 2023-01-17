const { findUserBySearchString, showAllUsers } = require("./user.service");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content and more of a home page.");
};

exports.searchUserController = async (req, res) => {
  try {
    const result = await findUserBySearchString(req.query.searchString);
    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .send("We are unable to process your request at this moment");
  }
};

exports.allUsers = async (req, res) => {
  try {
    const payload = {
      limit: req.query.limit ? req.query.limit : 5,
      offset: req.query.offset ? req.query.offset : 0,
    };
    const result = await showAllUsers(payload);
    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .send("Unable to process your get all users request at this moment");
  }
};

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };
