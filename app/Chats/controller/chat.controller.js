const { initiateChat } = require("../service/chat.service");

exports.initiate = async (req, res) => {
  try {
    const { userIds } = req.body;
    const { roomType } = req.query;
    const chatInitiator  = req.userId;
    const allUserIds = [...userIds, chatInitiator];
    const chatRoom = await initiateChat(allUserIds, roomType, chatInitiator);
    return res.status(200).json({ success: true, chatRoom });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};
