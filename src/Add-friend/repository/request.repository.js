const Request = require("../models/request.model");

exports.createRequest = async (receiverId, senderId) => {
  const request = Request.create({
    receiverId: receiverId,
    senderId: senderId,
  });
  return request;
};

exports.findRequestById = async (_id) => {
  return Request.findById({ _id: _id });
};

exports.updateRequestStatus = async (_id) => {
  return Request.findOneAndUpdate(
    { _id: _id },
    { $set: { requestAccepted: true } },
    { new: true, upsert: true }
  );
};
