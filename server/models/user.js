const mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', {
  username: {type: String, required: true, unique: true},
  email: {type: String, unique: true},
  password: {type: String, required: true},
  salt: {type: String, required: true},
  pepper: {type: String, required: true},
  firstName: {type: String},
  lastName: {type: String},
  battletag: {type: String},
  profilePic: {type: String},
  isAdmin: {type: Number, default: 0},
  discussions: [{type:Schema.Types.ObjectId, ref: "discussion"}]
})
