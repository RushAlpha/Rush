var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./db.js');

app.use(express.static(__dirname + '/../client/views'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



app.get('/users', function(req, res){
  db.find(function(err, users){
    res.send(users);
  })
});



app.post('/signin', function(req, res){
  db.find({email: req.body.username}, function(err, user){
    console.log(user);
    if(user.email === req.body.username){
      res.redirect('../client/index.html');
    } else {
      res.redirect('../views/signUp.html');
    }
  })
});



app.post('/signup', function(req, res){
  db.insert({email: req.body.username, password: req.body.username, isOwner: Boolean})
  res.send();
});




app.listen(1738, function(){
	console.log('RUSH server is up and listening at port 1738');
});
