var User = require('../models/user');

module.exports.create = function(req,res){
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
