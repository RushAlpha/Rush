var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');




app.use(express.static(__dirname + '/../client'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());



app.post('/', function(req, res){

});

app.listen(1738, function(){
	console.log('RUSH server is up and listening at port 1738');
});
