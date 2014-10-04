var restify = require('restify');
var mongojs = require("mongojs");
var crudify = require("./crudify");
var port    =  process.env.PORT || '5000';
restify.CORS.ALLOW_HEADERS.push('authorization');

var server = restify.createServer({
    name : "node-mongo-rest-jwt-server"
});
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS({origins: ['*']}));
server.use(restify.fullResponse());

server.listen(port, function(){
    console.log('%s listening at %s ', server.name , server.url);
});

var connection_string = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || '127.0.0.1:27017/rest-jwt-server';
var db = mongojs(connection_string);

var options = {
	server: server,
	path: 'v1',
	db: db,
	jwtSecret: process.env.JWT_SECRET || 'put_your_secret_in_env_variable'
};
crudifyResource = crudify(options);
var resources = process.env.REST_RESOURCES || 'resource-name';
resources.split(',').forEach(crudifyResource);
