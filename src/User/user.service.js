const { user } = require("../Config/auth.config");
const {
  getAllUsers,
  countAllUsers,
  getUserBySearchString,
  findByUsername,
  findUserByEmail,
} = require("./user.repository");

exports.findUserBySearchString = async (searchString) => {
  const username = await findByUsername(searchString);
  if (username) {
    const result = {
      _id:username._id,
      name:username.username,
      email:username.email,
      status:username.status,
      friendList: username.friendList
    }
    return result;
  }
  const email = await findUserByEmail(searchString);
  if (email) {
    const result = {
      _id:email._id,
      name:email.username,
      email:email.email,
      status:email.status,
      friendList: email.friendList
    }
    return result;
  }
  const users = await getUserBySearchString(searchString);
  return users;
};

exports.showAllUsers = async ({ limit, offset }) => {
  const totalUser = await countAllUsers();
  const users = await getAllUsers(limit, offset);
  return { totalUser, users };
};
