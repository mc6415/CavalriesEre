const Message = require('../models/message');
const Discussion = require('../models/discussion');

module.exports.remove = function(req,res){
  Message.findById(req.params.id, function(err,msg){
    Discussion.findById(msg.discussion, function(err, disc){
      console.log(disc.messages);
      disc.messages.pull(req.params.id);
      disc.save(function(err, disc){
        Message.remove({_id: req.params.id}, function(err, removed){
          res.redirect('/discussion/viewDiscussion/' + disc._id)
        })
      })
    })
  })
}
