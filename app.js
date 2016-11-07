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
    cookieParser = require('cookie-parser');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

mongoose.connect('mongodb://52.209.245.166:27018/overwankers');
app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/', express.static(__dirname + '/public/views'));
app.use('/js', express.static(__dirname + '/public/js'))

app.get('/', function(req,res){
  res.render('index', {title: 'Welcome to Overwankers'})
})

// Listen on port 3000, IP defaults to 127.0.0.1
app.listen(port, function(){
  console.log("Server now listening on port " + port);
})
