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
      if (err){
        res.send({hasAccount: result, isOwner: users[0].isOwner});
      } else {
          var stringUID = users[0]._id.toString();
          var token = tokenGenerator.createToken({ uid: stringUID, some: "arbitrary", data: "here" });
        res.send({hasAccount: result, isOwner: users[0].isOwner, token: token});

      }
    })} else {
      res.send({hasAccount: notSignedUp});
    }
  });
});

app.post('/getOwnerLocation', function(req, res){
  newUser.find({_id: req.body.uid}, function(err, users){
    if(users.length){
      console.log("THIS IS A USERS LOCATION GETTER", users[0]);
      res.send({address: users[0]});
    }
  })
});

app.post('/signup', function(req, res){

  var userPasswornewUsereforeEncryption = req.body.password;
  var hashedPassword;
  var userNameTaken = false;

  newUser.find({email: req.body.username}, function(err, users){
  if(users.length === 0){

    bcrypt.hash(userPasswornewUsereforeEncryption, saltRounds, function(err, hash){
      req.body.address = req.body.address || null;
      restName = req.body.restName || null;
      console.log("this is req.body.address", req.body.address)
      new newUser({email: req.body.username, password: hash, isOwner: req.body.isOwner, location: req.body.address, restName: req.body.restName, deals: [], declaredRush: false})
      .save(function(err, post){
        if(err) {
          console.log("error!")
        } else {
          newUser.find({email: req.body.username}, function(err, users){
            if (err){
              console.log(err)
            } else {
            console.log("signing up", users);
          var stringUID = users[0]._id.toString();
          var token = tokenGenerator.createToken({ uid: stringUID, some: "arbitrary", data: "here" });
          res.send({token: token, isOwner: users[0].isOwner});
          }


      });
    };

  })
  })
  } else {
    console.log("Username TAKEN! Sending FALSE signal to Client!");
    res.send(userNameTaken);
  }

  });

});

app.post('/ownerAddItemToMenu', function(req, res){
newUser.find({_id: req.body.uid}, function(err, users){
        if (users.length > 0){
          console.log(req.body.uid, "INSIDE ADD ITEMS TO MENU");
          newUser.findOneAndUpdate({_id: req.body.uid},
            {$push:{"deals": {item: req.body.item, price: req.body.price}}},
             {safe: true, upsert: true, new : true},
             function(err, model){
              console.log("items have been added to menu");
          })
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
    })
    //sending client object with id's correlating with deals
    res.send(allTheDeals);
  })
})

app.get('/getRushes', function(req,res){
  newUser.find({isOwner: true}, function(err, owners){
    //make empty response object
    var allTheLocations = [];
    //for all owners, store into object with id key and deals value
    owners.forEach(function(owner){
      restaurant = {}
      restaurant.restName = owner.restName;
      restaurant.address = owner.location;
      restaurant.deals = owner.deals;
      allTheLocations.push(restaurant);

    })
    //sending client object with id's correlating with deals
    res.send(allTheLocations);
  })
})

app.post('/declareRush', function(req,res){
  //find owner within db & set their declaredRush = TRUE
  newUser.findOneAndUpdate({_id: req.body.uid}, {'$set': {declaredRush: true}}, function(err,success){
    if (err){
      console.log("Error in Updating!: ",err)
    }
    else
    {
      console.log(req.body.email,"'s declaredRush Property was successfully changed to TRUE!");
      //loop through db to check if owner declaredRush: if yes, send info to client
      newUser.find({_id: req.body.uid}, function(err, owners){
        owners.forEach(function(owner){
        if(owner.declaredRush){
          res.send({
            restaurant: owner.resName,
            address: owner.resAddy,
            deals: owner.deals
          });
        }
        else
          {
           console.log('No Owners have declaredRush!');
          }
        });
      });
    }
  }});
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
