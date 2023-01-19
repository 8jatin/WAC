const { startChat, sendMessageInChat } = require("./chat.service");

exports.getAllChats = async (req, res) => {
    try {
        const payload = {
            limit : req.query.limit,
            offset: req.query.limit,
            userId: req.userId
        }
        const result = await getChats(payload);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.initiateChat = async (req, res) => {
  try {
    const payload = {
        from:req.userId,
        to: req.body.userIds,
        type: req.query.type,
        chatName: req.body.chatName
    }
    const initiate = await startChat(payload);
    console.log(initiate);
    res.status(200).send(initiate);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.sendMessage = async (req, res) => {
    try {
        const payload = {
            message: req.body.message,
            sender: req.userId,
            chatId: req.params.id
        }
        const result = await sendMessageInChat(payload);
        console.log('---HERE---',result);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send(`Message can't be delivered at the moment`);
    }
};

exports.selectChat = async (req, res) => {
};

exports.deleteChat = async (req, res) => {};

exports.markAllConversationRead = async (req, res) => {};
