var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rush');
var Schema = mongoose.Schema;

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  // we're connected!
  console.log('dbConnected!');
});

var usersSchema = new Schema ({
  local: {
    email: String,
    password: String,
    isOwner: Boolean,
    hasAccount: Boolean,
    deals: [],
    address: {}
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

var User = mongoose.model('users', usersSchema);

module.exports = User;