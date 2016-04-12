var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rush');
var Schema = mongoose.Schema;

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  // we're connected!
  console.log('dbConnected!');
});

var usersSchema = new Schema ({
    email: String,
    password: String,
    isOwner: Boolean,
    hasAccount: Boolean,
    deals: [
  {
    item: {type: String, required: true},
    price: {type: Number, required: true}
  }],
    restName: String,
    address: [
  {
    lat: {type: Number, required: true},
    lng: {type: Number, required: true}
  }]
});

var User = mongoose.model('users', usersSchema);

module.exports = User;