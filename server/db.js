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
  isOwner: Boolean
});
var User = mongoose.model('users', usersSchema);

// Test: Inserting a User called Neil into users.
var neil = new User ({email: 'nagar001@ucr.edu', password: 'neil', isOwner: false});
neil.save(function(error) {
  if(error) {
    console.log(error);
  } else {
    console.log('successful');
  }
});

module.exports = User;