const Discussion = require('../models/discussion');

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
