var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rush');
var Schema = mongoose.Schema;

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  // we're connected!
  console.log('db connected');
});

var usersSchema = new Schema ({
  email: String,
  password: String,
  isOwner: Boolean,
  location: [],
  deals: []
  // will probs implement ownerMaker within server.js in app.post('/client/owner') or some similar route.
  // ownerMaker fn that will ONLY be called if(isOwner).
  // ownerMaker: function(isOwner) {
  //   if(isOwner) {
  //     // If yes, create the owner object with his/her information (addy, deals, etc)
  //     var Owner = {
  //       deals: [],
  //       address: '',
  //       addDeal: function(/*ownerDeal from owner.html form input*/) {
  //         deals.push(/*ownerDeal from owner.html form input*/);
  //       }
  //     };
  //   } else { //If no, return out of ownerMaker fn.
  //     return;
  //   }
  // }
});

var User = mongoose.model('users', usersSchema);

// Test: Inserting a User called Neil into users.
// var neil = new User ({email: 'nagar001@ucr.edu', password: 'neil', isOwner: false});
// neil.save(function(error) {
//   if(error) {
//     console.log(error);
//   } else {
//     console.log('successful');
//   }
// });

module.exports = User;