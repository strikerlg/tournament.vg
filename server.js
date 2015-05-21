var express = require('express');
var compress = require('compression')();
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

var app = express();
app.use(compress);

app.set('port', (process.env.PORT || 5000));
app.use(serveStatic('public', {'index': ['index.html', 'index.htm']}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/bower_components'));

app.listen(app.get('port'), function() {
	console.log('Node server is running at: ' + app.get('port'));
});

// Add headers
app.use(function(req, res, next) {

	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next();

});