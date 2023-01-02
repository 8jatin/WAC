const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  chatInitiator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  userIds: { type: Array },
  roomType : String, //It could be (SOLO | GROUP)
},{
    timestamps: true
});

const Chatroom = mongoose.model("Chatroom", chatroomSchema);

module.exports = Chatroom;
