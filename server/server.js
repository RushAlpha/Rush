var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./db.js');

app.use(express.static(__dirname + '/../client'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



app.post('/signin', function(req, res){
  //Flag for server-to-client signal
  var isLoggedIn;
	  console.log(req.body.username, "INSIDE POST");

  //Filter database for username and password match
  db.find({email: req.body.username, password: req.body.password}, function(err, users){
   
    //if username&password match found; send TRUE signal to client
    if(users.length){
      console.log("success");
      isLoggedIn = true;
      res.send(isLoggedIn);

    //if username&password match found; send FALSE signal to client
    } else {
      console.log("fail");
      isLoggedIn = false;
      res.send(isLoggedIn);
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
