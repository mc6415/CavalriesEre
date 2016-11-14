const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// very very basic testing that I can set up a ref properly on MongoDB
var discussionSchema = new Schema({
  title: String,
  createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
  createdOn: Date
})

module.exports = mongoose.model('Discussion', discussionSchema);
