const Discussion = require('../models/discussion');
const Message = require('../models/message');

// This is not the complete implementation this was merely testing MongoDB refs
module.exports.create = function(req,res){
  const disc = new Discussion();
  disc.createdOn = new Date();
  disc.createdBy = req.params.id;
  disc.title = req.body.title;

  disc.save(function(err,disc){
    res.redirect('/user/profile/' + req.params.id)
  })
}

module.exports.getAll = function(req,res){
  Discussion.find({}).populate('createdBy').exec(function(err, docs){
    console.log(docs);
  })
}

module.exports.viewDiscussion = function(req,res){
  Discussion.findById(req.params.id)
    .populate('createdBy')
    .populate({
      path: 'messages',
      populate: {path: 'createdBy'}
    })
    .exec(function(err,disc){
    console.log(disc);
    res.render('discussion', {loggedIn: true, discussion: disc, user: req.session.user})
  })
}

module.exports.addMessage = function(req,res){
  const msg = new Message();
  msg.createdOn = new Date();
  msg.createdBy = req.session.user._id;
  msg.body = req.body.message;
  msg.discussion = req.params.id;

  msg.save(function(err,msg){
    Discussion.findById(req.params.id, function(err, disc){
      disc.messages.push(msg._id);
      disc.save(function(){
        res.redirect('/discussion/viewDiscussion/' + req.params.id)
      });
    })
  })

}
