// ### Constants ###

var port = 3001;

// ### Application ###

var express = require('express');
var Session = require('express-session');
var RedisStore = require('connect-redis')(Session);
var http = require('http');

var app = express();

app.use(Session({
	store: new RedisStore({}),
	secret: 'keyboard cat'
}));

app.all('/cart/items/:itemID', function(request, response) {
	var sessionData = request.session;
	setTimeout(function() {
		if (!sessionData.items) {
			sessionData.items = [];
		}
		sessionData.items.push(request.params.itemID);
		response.send({ items: sessionData.items });
	}, 5000);
});

app.get('/cart', function(request, response) {
	response.send({ items: request.session.items || [] });
});

// ### Init ###

var server = http.createServer(app);
server.on('listening', function initSuccess() {
	console.log('* Application listening on port %d', port);
});
server.on('error', function initFailed(error) {
	console.error('* Application init failed: %s', error ? (error.stack || error) : error);
});

server.listen(port);
