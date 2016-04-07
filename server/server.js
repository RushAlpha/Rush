var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rush');
var Schema = mongoose.Schema;

app.use(express.static(__dirname + '/../client/views'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

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
var neil = new User ({email: 'nagar001@ucr.edu', password: 'neil', isOwner: false});
neil.save(function(error) {
  if(error) {
    console.log(error);
  } else {
    console.log('successful');
  }
});


app.get('/users', function(req, res){
  User.find(function(err, users){
    res.send(users);
  })
});

app.listen(1738, function(){
	console.log('RUSH server is up and listening at port 1738');
});
