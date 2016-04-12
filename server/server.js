var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var newUser = require('./db.js');
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

var saltRounds = 10;
var notSignedUp = false;

app.post('/signin', function(req, res){
  //Filter database for username match
  newUser.find({email: req.body.username}, function(err, users){
    //if match is found...
    if(users.length){
    //Compare user inputted password with hashed password in database
    bcrypt.compare(req.body.password, users[0].password, function(err, result) {
        res.send({hasAccount: result, isOwner: users[0].isOwner});
    })} else {
      res.send({hasAccount: notSignedUp});
    }
  });
});

app.post('/signup', function(req, res){

  var userPasswornewUsereforeEncryption = req.body.password;
  var hashedPassword;
  var userNameTaken = false;

  newUser.find({email: req.body.username}, function(err, users){
  if(users.length === 0){

    bcrypt.hash(userPasswornewUsereforeEncryption, saltRounds, function(err, hash){
      req.body.address = req.body.address || null;
      new newUser({email: req.body.username, password: hash, isOwner: req.body.isOwner, location: req.body.address, deals: [], address: []})
      .save(function(err, post){
        if(err) {
          return next(err);
        } else {
          res.send(post);
        }
      });
    });

  } else {
    console.log("Username TAKEN! Sending FALSE signal to Client!");
    res.send(userNameTaken);
  }

  });

});

app.post('/ownerAddItemToMenu', function(req, res){
newUser.find({email: req.body.username}, function(err, users){
    bcrypt.compare(req.body.password, users[0].password, function(err, result) {
        //if credentials are correct...
        if(result){
          newUser.findOneAndUpdate({email: req.body.username}, {$push:{"deals": {item: req.body.item, price: req.body.price}}}, {safe: true, upsert: true, new : true}, function(err, model){
          //return true or false depending on if credentials are right
          res.send(result);
          })
        } else {
          res.send(result);
        }
    })
})
});


/*
app.post('/ownerRemoveItemFromMenu', function(req, res){
    newUser.find({email: req.body.username}, function(err, users){
    //if match is found...
    if(users.length){
    //Compare user-inputed password with hashed password in database
    bcrypt.compare(req.body.password, users[0].password, function(err, result) {
        //if credentials are correct...
        if(result){
          //remove server-given-item from respective owner object in database
            //from: http://stackoverflow.com/questions/5767325/remove-a-particular-element-from-an-array-in-javascript
            var index = users[0].deals.indexOf(req.body.CLIENTSIDEDEAL);
            users[0].deals.splice(index,1);
        }
        //return true or false depending on if credentials are right
        res.send(result);
    })} else {
      console.log("Credentials WRONG.  Sending FALSE signal to Server");
      res.send(notSignedUp);
    }
  })
});
*/

app.listen(1738, function(){
  console.log('Server is READY & LISTENING @ Port 1738!');
});
