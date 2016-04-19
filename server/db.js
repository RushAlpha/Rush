var mongoose = require('mongoose');
var env = process.env.NODE_ENV = process.env.NODE_ENV || "development" ;
console.log("EVNIRONMENT", env);
if (env === "development"){
mongoose.connect('mongodb://localhost/rush');
} else {
mongoose.connect('mongodb://eric:rush@ds025180.mlab.com:25180/rush');
console.log("CONNECTED TO MONGO SERVER");
}

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

var User = mongoose.model('users', usersSchema);

module.exports = User;
