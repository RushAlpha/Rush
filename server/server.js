var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./db.js');

app.use(express.static(__dirname + '/../client'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



app.get('/users', function(req, res){
  db.find({}, function(err, users){
    res.send(users);
  })
});



app.post('/signin', function(req, res){
	    console.log(req.body.username, "INSIDE POST BAE");
  db.find({email: req.body.username}, function(err, user){

    if(user.email === req.body.username){
      res.redirect('/');
    } else {
      res.redirect('/signup');
    }
  })
});



app.post('/signup', function(req, res){
	console.log("received post request from signup");
	new db({email: req.body.username, password: req.body.password, isOwner: req.body.isOwner})
	.save(function(err, post){
		if(err) {
			return next(err);
		} else {
			res.send(post);
		}
	})
});




app.listen(1738, function(){
	console.log('RUSH server is up and listening at port 1738');
});
