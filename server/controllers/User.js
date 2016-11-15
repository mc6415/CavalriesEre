const User = require('../models/user');
const sha256 = require('sha256');
const randomstring = require('randomstring');
const key = 'userToken';
const fs = require('fs');

module.exports.create = function(req,res){
  const user = new User();
  const salt = randomstring.generate(10);
  const pepper = randomstring.generate(10);

  user.username = req.body.username;
  user.email = req.body.email;
  user.salt = salt;
  user.pepper = pepper;
  user.password = sha256(user.salt) + sha256(req.body.password) + sha256(pepper);
  user.firstName = req.body.forename;
  user.lastName = req.body.surname;
  user.profilePic = req.body.pic;
  user.save(function(err, user){
    res.redirect('/');
  });
}

module.exports.login = function(req,res){
  User.find({username: req.body.username}, function(err,docs){
    if(docs.length > 0){
      const user = docs[0];
      const passwordEntry = sha256(user.salt) + sha256(req.body.password) + sha256(user.pepper);
      if(passwordEntry == user.password){
        req.session.user = user;
        res.redirect('/');
      }
    } else {
      res.redirect('/');
    }
  })
}

module.exports.signout = function(req,res){
  req.session.destroy(function(){
    res.redirect('/');
  })
}

module.exports.profile = function(req,res){
  fs.readdir('./public/img/cutesprays', function(err,files){
    res.render('profile', {user:req.session.user, loggedIn: true, pics: files})
  })
}

module.exports.updateProfile = function(req,res){
  User.findById(req.session.user._id, function(err,user){
    if(!(typeof(user) == 'undefined')){
      user.firstName = req.body.firstName;
      user.lastName = req.body.surname;
      user.email = req.body.email;
      user.profilePic = req.body.pic;
      user.save(function(err, updatedUser){
        req.session.user = user;
        res.redirect('/')
      })
    }
  })
}
