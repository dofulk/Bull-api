const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  phoneNumber: {
    type: String,
    unique: true,
    required: [true, 'Phone number required']
  },
  username: {
    type: String,
    required: [true, 'User required']
  },
  password: {
    type: String,
    required: [true, 'Password required']
  }
  avatar: {
    data: Buffer,
    type: String,
  }
  
});



const User = mongoose.model('user', UserSchema);

module.exports = User;
