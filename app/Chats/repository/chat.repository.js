const Chatroom = require("../model/chat.model");

exports.createChatRoom = async ({ userIds, roomType, chatInitiator }) => {
  const newRoom = Chatroom.create({ userIds, roomType, chatInitiator });
  return newRoom;
};

exports.findExistingRoom = async ({ userIds, roomType }) => {
  const availableRoom = Chatroom.findOne({
    userIds: {
      $size: userIds.length,
      $all: [...userIds],
    },
    roomType,
  });
  return availableRoom;
};
