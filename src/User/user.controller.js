const UserService = require('./user.service')

const UserController = class{
  constructor(){
    this.UserService = new UserService();
  }
  allAccess = (req, res) => {
    res.status(200).send("Public Content and more of a home page.");
  };
  
  searchUserController = async (req, res) => {
    try {
      const users = await this.UserService.findUserBySearchString(req.query.searchString);
      const result = users.length===0?`No matching user exists`:users;
      res.status(200).send(result); 
    } catch (error) {
      res
        .status(404)
        .send("User doesn't exist");
    }
  };
  
  allUsers = async (req, res) => {
    try {
      const payload = {
        limit: req.query.limit ? req.query.limit : 5,
        offset: req.query.offset ? req.query.offset : 0,
      };
      const result = await this.UserService.showAllUsers(payload);
      res.status(200).send(result);
    } catch (error) {
      res
        .status(500)
        .send("Unable to process your get all users request at this moment");
    }
  };
}

module.exports = UserController

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };
