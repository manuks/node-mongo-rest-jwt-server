
npm install restify-crudify

An example implementation

<code>
// app.js

var restify = require('restify');
var mongojs = require("mongojs");
var crudify = require("restify-crudify");
 
var port    =  process.env.PORT || '8080';
 
var server = restify.createServer({
    name : "node-server"
});
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.listen(port, function(){
    console.log('%s listening at %s ', server.name , server.url);
});

var connection_string = process.env.MONGOHQ_URL;
var db = mongojs(connection_string, ['dbname']);

var options = {
	server: server,
	path: 'v1',
	db: db
	//auth: resity-jwt
};

crudify('tv-channel',options);
crudify('tv-channel-programs',options);

</code>

node app.js

This will make the following urls work. (please change the mongo_document_id in the url)

GET http://localhost:8080/v1/tv-channel
POST http://localhost:8080/v1/tv-channel
GET http://localhost:8080/v1/tv-channel/5423d8b58fcda0bd629a1ba2
PUT http://localhost:8080/v1/tv-channel/5423d8b58fcda0bd629a1ba2
DELETE http://localhost:8080/v1/tv-channel/5423d8b58fcda0bd629a1ba2

GET http://localhost:8080/v1/tv-channel-programs
POST http://localhost:8080/v1/tv-channel-programs
GET http://localhost:8080/v1/tv-channel-programs/5423d8b58fcda0bd629a1ba2
PUT http://localhost:8080/v1/tv-channel-programs/5423d8b58fcda0bd629a1ba2
DELETE http://localhost:8080/v1/tv-channel-programs/5423d8b58fcda0bd629a1ba2