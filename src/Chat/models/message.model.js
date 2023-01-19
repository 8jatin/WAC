const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema({
  _id: false,
  messageId:{
      type: String
  },
  isRead: {
      type: Boolean,
      default: false
  },
  userIds: Array,
  readAt : {
      type: Date,
      default: Date.now()
  }
  });

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  readers: [recipientSchema]
},{
    timestamps:true
});

const Message = mongoose.model("Message",messageSchema);
module.exports = Message;