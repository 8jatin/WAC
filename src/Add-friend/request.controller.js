const { sendRequest, acceptRequest } = require("./request.service");

exports.sendRequestController = async (req, res) => {
  try {
    // console.log(req);
    await sendRequest(req, res);
    res
      .status(201)
      .send(
        `Request send to ${req.body.username} , Please wait till they approve your request to interact with them`
      );
  } catch (error) {
    res.status(500).send(`We cannot send your friend request at this moment`);
  }
};

exports.acceptRequestController = async (req, res) => {
    try {
      // console.log(req);
      await acceptRequest(req, res);
      res
        .status(200)
        .send(
          `User ${req.body.username} and you are now friends`
        );
    } catch (error) {
      res.status(500).send(`Error while accepting the request`);
    }
  };
