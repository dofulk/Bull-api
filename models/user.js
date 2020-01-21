const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const saltRounds = 10

const UserSchema = new Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Phone number required']
  },
  username: {
    type: String,
    required: [true, 'User required']
  },
  password: {
    type: String,
    required: [true, 'Password required']
  },
});


UserSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
  });


const User = mongoose.model('user', UserSchema);

module.exports = User;
