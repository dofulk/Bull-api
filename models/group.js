const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: [true, 'group name required']
  },
  latest: {
    type: String,
  },
  users: {
    type: Array,
    items: {
      type: String
    },
    required: [true, 'users required']
  },

});



const Group = mongoose.model('group', GroupSchema);

module.exports = Group;
