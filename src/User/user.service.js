const {
  getUserByUsernameOrEmail,
  getAllUsers,
  countAllUsers,
} = require("./user.repository");

exports.findUserBySearchString = async (searchString) => {
  const users = await getUserByUsernameOrEmail(searchString);
  return users;
};

exports.showAllUsers = async ({ limit, offset }) => {
  const totalUser = await countAllUsers();
  const users = await getAllUsers(limit, offset);
  return { totalUser, users };
};
