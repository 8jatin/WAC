const User = require("../User/model/user.model");
const { updateStatusAfterConfirmation } = require("../User/user.repository");

exports.verifyUser = (req, res, next) => {
    User.findOne({
      confirmationCode: req.params.confirmationCode,
    })
      .then(async (user) => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        user.status = "Active";
        await updateStatusAfterConfirmation(user.confirmationCode);
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.status(200).send("Your email has been verified and account status has been changed to active");
        });
      })
      .catch((e) => console.log("error", e));
  };