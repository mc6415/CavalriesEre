const User = require('../models/user');
const sha256 = require('sha256');
const randomstring = require('randomstring');

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
  if(typeof(req.file) != 'undefined'){
    user.profilePic = req.file.buffer.toString('base64');
  }

  user.save();
  res.redirect('/');
}


// module.exports.login = function(req,res){
//     User.find({'username' : req.body.username}, function(err, docs){
//       if(docs.length > 0){
//         var pass = sha256(docs[0].salt) + sha256(req.body.password);
//         if(pass == docs[0].password){
//           var uid = docs[0]._id;
//           res.cookie('user', JSON.stringify(docs[0]));
//           res.redirect('/');
//         } else {
//           res.redirect('/error')
//         }
//       } else {
//         res.redirect('/error')
//       }
//     })
// }
//
// module.exports.SignOut = function(req,res){
//   res.clearCookie('user');
//   res.status(201).redirect('/');
// }
