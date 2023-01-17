const {
  findUserById,
  findByUsername,
  findAndUpdateUserRequest,
  updateUserFriendList,
} = require("../../User/user-repository/user.repository");
const {
  createRequest,
  findRequestById,
  updateRequestStatus,
} = require("../repository/request.repository");

exports.sendRequest = async (req, res) => {
  try {
    const currentUser = await findUserById(req.userId);
    const userToBeFriend = await findByUsername(req);

    if (!userToBeFriend) {
      res
        .status(404)
        .send(`User with username ${req.body.username} doesn't exist`);
    }

    const request = await createRequest(userToBeFriend._id, currentUser._id);

    const updatedFriendUser = await findAndUpdateUserRequest(req);
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const currentUser = await findUserById(req.userId);
    const userToBeFriend = await findByUsername(req);

    if (!userToBeFriend) {
      res
        .status(400)
        .send(
          `User with username ${req.body.username} no longer exists on this application`
        );
    }

    const request = await findRequestById(req.params.requestId);
    if (!request) {
      res.status(400).send("no more request left from this user");
    }
    const requestAccepted = await updateRequestStatus(request._id);
    const updateUser = await updateUserFriendList(
      request.receiverId,
      request.senderId
    );
  } catch (error) {
    res.status(500).send("we are unable to process the request at the moment");
  }
};
