const {
  findExistingRoom,
  createChatRoom,
} = require("../repository/chat.repository");

exports.initiateChat = async (userIds, roomType, chatInitiator) => {
  try {
    const availableRoom = await findExistingRoom({ userIds, roomType });
    if (availableRoom) {
      return {
        isNew: false,
        message: "retrieving old chats",
        chatroomId : availableRoom._id,
        type: availableRoom.roomType
      };
    }
    const newRoom = await createChatRoom({ userIds, roomType, chatInitiator });
    return {
        isNew:true,
        message: "creating a new chatroom",
        chatroomId :newRoom._id,
        roomType:newRoom.roomType
    };
  } catch (error) {
    console.log("error at start chat method", error);
    throw error;
  }
};
