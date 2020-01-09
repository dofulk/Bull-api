const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: String,
    required: [true, 'user required']
  },
  message: {
    type: String,
    required: [true, 'message required']
  },
  hearts: {
    type: Array,
    items: {
      type: String
    }

  },
  chat: {
    type: String,
    required: [true, 'chat required']
  },
  date: {
    type: String,
    required: [true, 'date required']
  },
  type: {
    type: String,
    default: 'text',
  },
  imgId: {
    type: String,
  }
  
});



const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;
