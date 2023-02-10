const UserRepository = require("./user.repository");

const UserService = class {
  constructor() {
    this.UserRepository = new UserRepository();
  }
  findUserBySearchString = async (searchString) => {
    const username = await this.UserRepository.findByUsername(searchString);
    if (username) {
      const result = {
        _id: username._id,
        name: username.username,
        email: username.email,
        status: username.status,
        friendList: username.friendList,
      };
      return result;
    }
    const email = await this.UserRepository.findUserByEmail(searchString);
    if (email) {
      const result = {
        _id: email._id,
        name: email.username,
        email: email.email,
        status: email.status,
        friendList: email.friendList,
      };
      return result;
    }
    const users = await this.UserRepository.getUserBySearchString(searchString);
    return users;
  };

  showAllUsers = async ({ limit, offset }) => {
    const totalUser = await this.UserRepository.countAllUsers();
    const users = await this.UserRepository.getAllUsers(limit, offset);
    return { totalUser, users };
  };

  deleteUser = async({userId})=>{
    const user = await this.UserRepository.findUserById(userId);
    await this.UserRepository.deleteUserFromDB(userId);
    return user;
  }
};

module.exports = UserService;
