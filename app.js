var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html'),
    express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    controllers = require('./server/controllers/Namespace.js'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    multer = require('multer');
    aes256 = require('aes256');
    User = require('./server/models/user');
    fs = require('fs');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var isLoggedIn = function(req){
  var loggedIn = (typeof(req.cookies.user) == 'undefined');
  return !loggedIn;
}

mongoose.connect('mongodb://sa:pass@52.209.245.166:27018/cavalriesere');
app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
var upload = multer({storage: multer.memoryStorage({}) });
app.use('/', express.static(__dirname + '/public/views'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'));

const key = 'userToken';
const cipher = aes256.createCipher(key);

app.get('/', function(req,res){
  if(isLoggedIn(req)){
    try{
      var user = JSON.parse(cipher.decrypt(req.cookies.user));
    } catch(ex) {
      res.redirect('/user/signout')
    }
    console.log(user);
    User.find({username: user.username}, function(err,docs){
      res.render('index', {loggedIn: true, user: docs[0]})
    })
  } else {
    fs.readdir('./public/img/cutesprays', function(err,files){
      res.render('index', {title: 'Cheers Love, Cavalries \'ere', pics: files})
    })
  }
})
app.get('/getallpics', function(req,res){

})
app.get('/user/signout', controllers.User.signout);
app.get('/user/profile/:id', controllers.User.profile);

app.post('/user/create',upload.single('pic'), controllers.User.create);
app.post('/user/login', controllers.User.login);
app.post('/user/updatepic',upload.single('pic'), controllers.User.updatePic);

// Listen on port 3000, IP defaults to 127.0.0.1
app.listen(port, function(){
  console.log("Server now listening on port " + port);
})
