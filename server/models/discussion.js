const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var discussionSchema = new Schema({
  title: String,
  createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
  createdOn: Date
})

module.exports = mongoose.model('Discussion', discussionSchema);
