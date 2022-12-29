const {
  findByUsername,
} = require("../../User/user-repository/user.repository");

exports.findUser = async (req, res) => {
  const user = await findByUsername(req, res);
  res
    .status(200)
    .send({
      message: `The user ${user.username} is found and here is the profile of user`,
      name : user.username,
      email: user.email,
      friends: user.friendList,
    });
};
