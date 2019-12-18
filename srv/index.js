var server = require('ws').Server;
var s = new server({port: 5001});

s.on('connection', function (ws) {
	ws.on('open', function(e){console.log(e);});

    ws.on('message', function (message) {
        console.log("Received: " + message);

        s.clients.forEach(function (client) {
            client.send(message);
        });
    });

    ws.on('close', function (e) {
        console.log('I lost a client', e);
    });

	console.log("start server;");

});
