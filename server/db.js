// npm install mongoose --save & Require Mongoose
var mongoose = require('mongoose');
// env is the environment in which your Terminal is processing your git commands.
  //In "development", the db will connect to your localhost url + port.
var env = process.env.NODE_ENV = process.env.NODE_ENV || "development" ;
console.log("terminalEnvironment: ", env);

mongoose.connect('mongodb://localhost/rush');

// declare a new Schema using mongoose's Schema method. See Docs.
var Schema = mongoose.Schema;
// When mongoose fails to connect...
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
// When mongoose successfully connects...
mongoose.connection.once('open', function() {
  console.log('MongoDB is Connected!');
});
// Define your Users' Schema.
  // We Decided to Have an overall User;
  // and We Distinguish between Owner & Consumer via a Boolean (isOwner).
var usersSchema = new Schema ({
    email: String,
    password: String,
    isOwner: Boolean,
    location: {lat: {type: Number}, lng: {type:Number}},
    hasAccount: Boolean,
    deals: [{
      item: {type: String, required: true},
      price: {type: Number, required: true}
    }],
    rushDeals: [{
     item: {type: String, required: true},
     price: {type: Number, required: true}
    }],
    restName: String,
    restAddress: String,
    declaredRush: Boolean
  });
// Declare a User model using mongoose's model method. See Docs.
var User = mongoose.model('users', usersSchema);
// Export Your Model !
module.exports = User;