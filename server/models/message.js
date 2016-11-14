const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var messageSchema = new Schema({
  createdOn: Date,
  createdBy: {type: Schema.Types.ObjectId, ref:'User'},
  body: String,
  replyTo: {type: Schema.Types.ObjectId, ref: 'Message'},
  discussion: {type: Schema.Types.ObjectId, ref: 'Discussion'}
})

module.exports = mongoose.model('Message', messageSchema);
