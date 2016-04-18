var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var newUser = require('./db.js');
var twilio = require('twilio')('AC31273ed4502660534891a3a83ea025b9','9b4d360ef7251e6f6925210bbfa7d067');
var bcrypt = require('bcrypt');
var FirebaseTokenGenerator = require("firebase-token-generator");

var tokenGenerator = new FirebaseTokenGenerator("W3JqgeVOrax9lnD0xYLoWXvgCqtkE0bOv4GO93Hu");

app.use(express.static(__dirname + '/../client'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//saltrounds for bcrypt
var saltRounds = 10;
//FALSE flag
var notSignedUp = false;

app.post('/signin', function(req, res){
  //Filter database for username match
  newUser.find({email: req.body.username}, function(err, users){
    //if match is found...
    if(users.length){
      //Compare user inputted password with hashed password in database
      bcrypt.compare(req.body.password, users[0].password, function(err, result) {
        if (err){
          //hasAccount should read as "authenticated: result"
          res.send({hasAccount: result, isOwner: users[0].isOwner});
        } else {
          //create variable for token generator
          var stringUID = users[0]._id.toString();
          //create token
          var token = tokenGenerator.createToken({ uid: stringUID, some: "arbitrary", data: "here" });
          //send true signal for brcrypt compare with a token
          res.send({hasAccount: result, isOwner: users[0].isOwner, token: token});
        }
      })
    } else {
      //if username does not exist
      res.send({hasAccount: notSignedUp});
    }
  });
});

app.post('/getOwnerLocation', function(req, res){
  newUser.find({_id: req.body.uid}, function(err, users){
    if(users.length){
      console.log("User's locationGetter: ", users[0]);
      res.send({address: users[0]});
    }
  })
});

app.post('/signup', function(req, res){
  var userPasswornewUsereforeEncryption = req.body.password;
  var hashedPassword;
  var userNameTaken = false;

  newUser.find({email: req.body.username}, function(err, users){
    //if username is not taken...
    if(users.length === 0){
      //hash the password
      bcrypt.hash(userPasswornewUsereforeEncryption, saltRounds, function(err, hash){
        req.body.address = req.body.address || null;
        restName = req.body.restName || null;
        //add user to mongodb
        new newUser({email: req.body.username, password: hash, isOwner: req.body.isOwner, location: req.body.address, restName: req.body.restName, deals: [], declaredRush: false})
        .save(function(err, post){
          if(err) {
            console.log("error!")
          } else {
            newUser.find({email: req.body.username}, function(err, users){
              if (err){
                console.log(err)
              } else {
                //send token
                var stringUID = users[0]._id.toString();
                var token = tokenGenerator.createToken({ uid: stringUID, some: "arbitrary", data: "here" });
                res.send({token: token, isOwner: users[0].isOwner});
              }
            });
          };

        })
      })
      //if username taken...
    } else {
      console.log("Username TAKEN! Sending FALSE signal to Client!");
      res.send(userNameTaken);
    }
  });
});

app.post('/ownerAddItemToMenu', function(req, res){
  newUser.find({_id: req.body.uid}, function(err, users){
    if (users.length > 0){
      console.log("req.body.uid: ",req.body.uid);
      newUser.findOneAndUpdate({_id: req.body.uid},
        {$push:{"deals": {item: req.body.item, price: req.body.price}}},
        {safe: true, upsert: true, new : true},
        function(err, model){
          console.log("Deals Added!");
          res.send("Complete");
        }
      )
    }
  })
});


app.get('/ownerDeals', function(req,res){
  //find all owners
  newUser.find({isOwner: true}, function(err, owners){
    //make empty response object
    var allTheDeals = {};
    //for all owners, store into object with id key and deals value
    owners.forEach(function(owner){
      allTheDeals.deals = owner.deals;
      allTheDeals.restName = owner.restName;
    })
    //sending client object with id's correlating with deals
    res.send(allTheDeals);
  })
})

app.get('/getRushes', function(req,res){
  newUser.find({isOwner: true}, function(err, owners){
    //make empty response object
    var allRushes = [];
    //for all owners, store into object with id key and deals value
    owners.forEach(function(owner){
      if(owner.declaredRush){
        var restaurant = {}
        restaurant.restName = owner.restName;
        restaurant.location = owner.location;
        restaurant.address = owner.restAddress;
        restaurant.deals = owner.rushDeals;
        console.log(restaurant);
        allRushes.push(restaurant);
      }
    })
    res.send(allRushes);
    //sending client object with id's correlating with deals
     })
})

app.post('/declareRush', function(req,res){
  newUser.findOneAndUpdate({_id: req.body.uid}, {'$set': {declaredRush: true, rushDeals: req.body.rushDeals}}, function(err,success){
    if (err){
      console.log("Error in Updating: ",err)
    } else {

      newUser.find({_id: req.body.uid}, function(err, owners){
        owners.forEach(function(owner){
          if(owner.declaredRush){
            var restaurant = owner.restName;
            var sampleDealItem = req.body.rushDeals[0].item;
            var sampleDealPrice = req.body.rushDeals[0].price;
            var sampleDeal = 'ITEM: '+sampleDealItem+' & PRICE: $'+sampleDealPrice;
            var message = '[*NEW RUSH*] Come to '+restaurant+'! 1 of 5 Deals: '+sampleDeal+'! LogIn to Rush app & save that money!';
            var verifiedNumbers = ['+18319207839','+16262909006','+13232395800']
            for(var i=0;i<verifiedNumbers.length;i++){
              twilio.sendMessage({
                to: verifiedNumbers[i], // Consumer #'s Separated by Commas (NOT tested)
                from: '+14848988821', // OUR Twilio Account Number
                body: message
              }, function(err, data){
                  if (err) {
                    console.log('Error in Sending SMS! Error: ', err);
                    throw err;
                  }
                  console.log("SMS Sent!");
              });
            }
            res.send('Your Rush has been initiated!');
          } else {
            res.send("You haven't declared a Rush today!");
          }
        });
      });
    }
  })
});


app.listen(8123, function(){
  console.log('Server is READY & LISTENING @ Port 8123!');
});
