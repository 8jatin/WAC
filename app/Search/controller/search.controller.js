const { findUser } = require("../service /search.service");

exports.findUserController = async (req, res) => {
  try {
    await findUser(req,res);
  } catch (error) {
    res.status(404).send("user doesn't exist!");
  }
};
