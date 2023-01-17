const { useReducer } = require("react");
const {
  getUserByUsernameOrEmail,
  getAllUsers,
  countAllUsers,
} = require("../user-repository/user.repository");

exports.findUserBySearchString = async (req, res) => {
  const users = await getUserByUsernameOrEmail(req);
  res.status(200).send(users);
};

exports.showAllUsers = async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 5;
  const offset = req.query.offset ? req.query.offset : 0;
  const totalUser = await countAllUsers();
  const users = await getAllUsers(limit, offset);
  return { totalUser, users };
};
