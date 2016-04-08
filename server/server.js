var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./db.js');
var twilio = require('twilio')('AC31273ed4502660534891a3a83ea025b9','9b4d360ef7251e6f6925210bbfa7d067');
var bcrypt = require('bcrypt');


app.use(express.static(__dirname + '/../client'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/testtwilio', function(req,res){
  twilio.sendMessage({
    to: '+1**********', // Consumer #
    from: '+14848988821', // OUR Twilio Account Number
    body: '[*NEW RUSH*] Come to SeaSalt for $4 Burritos! Offer ends in 2 Hours!' // body will get inputs from Owner view
  }, function(err, data){
    if (err) {
      console.log('Error in Sending SMS! Error: ', err);
      throw err;
    }
    res.send(data);
    console.log("SMS Sent! Data: ", data);
  });
});



//Security Level--
var saltRounds = 10;
var notSignedUp = false;

app.post('/signin', function(req, res){
  //Flag for server-to-client signal
  var isLoggedIn;
	  console.log(req.body.username, "INSIDE POST");

  //Filter database for username and password match
  db.find({email: req.body.username, password: req.body.password}, function(err, users){

    //if username&password match found; send TRUE signal to client
  //Filter database for username match
  db.find({email: req.body.username}, function(err, users){
    //if match is found...
    if(users.length){
    //Compare user inputted password with hashed password in database
    bcrypt.compare(req.body.password, users[0].password, function(err, result) {
        console.log("this is the result", result);
        res.send(result);
    })} else {
      console.log("not signed up")
      res.send(notSignedUp);
    }
  })
});






app.post('/signup', function(req, res){

  var userPasswordBeforeEncryption = req.body.password;
  var hashedPassword;
  var userNameTaken = false;

  db.find({email: req.body.username}, function(err, users){

  if(users.length === 0){


    bcrypt.hash(userPasswordBeforeEncryption, saltRounds, function(err, hash){

      new db({email: req.body.username, password: hash, isOwner: req.body.isOwner})
      .save(function(err, post){
        if(err) {
          return next(err);
        } else {
          res.send(post);
        }
      })
    })

  }  else {
    console.log("that username is taken!");
    res.send(userNameTaken);
  }

  })

});




app.listen(1738, function(){
	console.log('RUSH server is up and listening at port 1738');
});
