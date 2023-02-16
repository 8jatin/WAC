const UserService = require('./user.service')
const fs = require('fs');
const path = require('path');
const imageLocation = '/Users/apple/Desktop/server/public/images/';

const UserController = class{
  constructor(){
    this.userService = new UserService();
  }
  allAccess = (req, res) => {
    res.status(200).send("Public Content and more of a home page.");
  };
  
  searchUserController = async (req, res) => {
    try {
      const users = await this.userService.findUserBySearchString(req.query.searchString);
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
      const result = await this.userService.showAllUsers(payload);
      res.status(200).send(result);
    } catch (error) {
      res
        .status(500)
        .send("Unable to process your get all users request at this moment");
    }
  };

  deleteUser = async(req,res)=>{
    try {
      const payload = {
        userId: req.userId
      }
      console.log(payload);
      const result = await this.userService.deleteUser(payload);
      fs.stat(path.join(imageLocation, `${result.profilePicture}`),(err,stats)=>{
        console.log('------STAT-----',stats);
        if(err){
          console.log(err);
        }
        fs.unlink(path.join(imageLocation, `${result.profilePicture}`),(error)=>{
          if(error){
            return console.log('-----UNLINK-ERROR------',error);
          }
          console.log("user image deleted successfully");
        })
      })
      res.send("Your account has been successfully deleted , hope you would join us again soon");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = UserController

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };
