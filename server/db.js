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
    location: {lat: {type: Number}, lng: {type:Number}},
    hasAccount: Boolean,
    deals: [
  {
    item: {type: String, required: true},
    price: {type: Number, required: true}
  }],
    restName: String,
    restAddy: String,
    declaredRush: Boolean
  });

var User = mongoose.model('users', usersSchema);

module.exports = User;