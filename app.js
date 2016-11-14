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
    Discussion = require('./server/models/discussion');
    fs = require('fs');

// This is nasty I know. doing this checking app.settings.env didn't work
// and npm install was failing on node-sass on my AWS instance.
try{
  const sassMiddleware = require('node-sass-middleware');
  app.use(sassMiddleware({
    src: __dirname + '/public/sass',
    dest: __dirname + '/public/css',
    debug: true,
    outputStyle: 'compressed',
    prefix:'/css'
  }))
} catch(ex){

}

// Added a line to the log that shows which Environment node is running in
var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', 'ENVIRONMENT IS ' + app.settings.env);
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

// Quick check to see if user is logged in.
var isLoggedIn = function(req){
  var loggedIn = (typeof(req.cookies.user) == 'undefined');
  return !loggedIn;
}

// Connect to my MongoDB instance running on an EC2 instance
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

// Create a cipher for encrypting and decrypting the user cookie, avoids
// setting details in plain text.
const key = 'userToken';
const cipher = aes256.createCipher(key);

app.get('/', function(req,res){
  if(isLoggedIn(req)){
    try{
      var user = JSON.parse(cipher.decrypt(req.cookies.user));
    } catch(ex) {
      // I did some changing of the user token with encryption, this made people
      // with the old token unable to load the site, this now takes them
      // to sign out and removes the cookie, allowing them to access again.
      res.redirect('/user/signout')
    }
    User.findById(user.id, function(err, user){
      Discussion.find({}).populate('createdBy').exec(function(err,docs){
        res.render('index', {loggedIn: true, user: user, discussions: docs})
      })
    })
  } else {
    fs.readdir('./public/img/cutesprays', function(err,files){
      res.render('index', {title: 'Cheers Love, Cavalries \'ere', pics: files})
    })
  }
})

app.get('/user/signout', controllers.User.signout);
app.get('/user/profile/:id', controllers.User.profile);
app.get('/discussion/viewDiscussion/:id', controllers.Discussion.viewDiscussion);
app.get('/message/remove/:id', controllers.Message.remove);

app.get('/discussion/start', function(req,res){
  if(isLoggedIn(req)){
    const user = JSON.parse(cipher.decrypt(req.cookies.user));
    res.render('discussionStart', {loggedIn: true, user: user})
  } else {
    res.redirect('/')
  }
})

app.post('/discussion/getAll', controllers.Discussion.getAll);
app.post('/user/create',upload.single('pic'), controllers.User.create);
app.post('/user/login', controllers.User.login);
app.post('/user/updateProfile/:id', controllers.User.updateProfile);
app.post('/discussion/create/:id', controllers.Discussion.create);
app.post('/discussion/addMessage/:id', controllers.Discussion.addMessage);

// Listen on port 3000, IP defaults to 127.0.0.1
app.listen(port, function(){
  console.log("Server now listening on port " + port);
})
