const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'user required']
  },
  avatar: {
    data: Buffer,
    type: String,
  }
  ,
  users: {
    type: Array,
    items: {
      type: String
    },
    required: [true, 'message required']

  },
});



const User = mongoose.model('user', UserSchema);

module.exports = User;
