var mongojs = require("mongojs"),
    restify = require('restify'),
	jwt = require('jsonwebtoken');
module.exports = function(options) {
  'use strict';
  if (!options || !options.server) {
    throw new Error('server should be set');
  }
  if (!options || !options.db) {
    throw new Error('db should be set');
  }
  if (!options || !options.jwtSecret) {
    throw new Error('jwtSecret should be set');
  }
  var server = options.server,
	path = options.path,
	version = options.version || '0.0.1',
	db = options.db,
	auth = function(req, res, next) {
		console.log('auth');
		if (req.headers && req.headers.authorization) {
		
		  var test = req.headers.authorization.match(/^Bearer (.*)$/);
		  if (test) {
			jwt.verify(test[1], options.jwtSecret, function(err, user) {
			  if (err) {
				return next(new restify.NotAuthorizedError('Invalid token'));
			  }

			  req.user = user;
			  next();
			});
		  } else {
			return next(new restify.NotAuthorizedError('Format is Authorization: Bearer [token]'));
		  }
		} else {
		  return next(new restify.NotAuthorizedError('No authorization header was found'));
		}
	},
	findAllResources = function(dbResource) {
		console.info('findAllResources');
		return function(req, res , next){
			console.info('user: ',req.user);
			dbResource.find().sort({postedOn : 1} , function(err , success){
				console.log('Response success '+success.len);
				console.log('Response error '+err);
				if(success && success.length){
					res.send(200 , success);
					return next();
				}
				res.send(404);
				return next(err);
		 
			});
		};
	},
	findResourceByProp = function(dbResource) {

		return function(req, res , next){

			dbResource.find({req.params.prop:req.params.value}).sort({postedOn : 1} , function(err , success){
				console.log('Response success '+success.len);
				console.log('Response error '+err);
				if(success && success.length){
					res.send(200 , success);
					return next();
				}
				res.send(404);
				return next(err);

			});
		};
	},
	findResourceById = function(dbResource) {
		return function(req, res , next){
			dbResource.findOne({_id:mongojs.ObjectId(req.params.resourceId)} , function(err , success){
				console.info('Response success '+success);
				console.log('Response error '+err);
				if(success){
					res.send(200 , success);
					return next();
				}
				res.send(404);
				return next(err);
			});
		};
	},
	deleteResourceById = function(dbResource) {

		return function(req, res , next){
			dbResource.remove({_id:mongojs.ObjectId(req.params.resourceId)} , function(err , success){
				console.log('Response success '+success);
				console.log('Response error '+err);
				if(success && success.n){
					res.send(204);
					return next();      
				} 
				res.send(404);
				return next(err);
				
			});
		};
	},
	updateResourceById = function(dbResource) {

		return function(req, res , next){
			var resource = req.params || {};
			resource.updatedOn = new Date();
			dbResource.update({_id:mongojs.ObjectId(req.params.resourceId)}, {$set: resource}, function(err , success){
				console.log('Response success '+success);
				console.log('Response error '+err);
				if(success && success.updatedExisting){
					console.log(success);
					res.send(204);
					return next();
				}
				res.send(404);
				return next(err);
				
			});
		};
	},
	postNewResource = function(dbResource) {

		return function(req, res , next){
			var resource = req.params || {};
			resource.postedOn = new Date();
			dbResource.save(resource , function(err , success){
				console.log('Response success '+success);
				console.log('Response error '+err);
				if(success){
					console.info(success);
					res.send(201 , resource);
					return next();
				} else {
					return next(err);
				}
			});
		};
	},
	addResource = function(resource) {
		console.info('addResource', resource);
		var dbResource = db.collection(resource);
		server.get({path : path + '/' + resource , version : version}, auth, findAllResources(dbResource));
		server.get({path : path + '/' + resource + '/:resourceId' , version : version}, auth, findResourceById(dbResource));
		server.post({path : path + '/' + resource , version: '0.0.1'}, auth, postNewResource(dbResource));
		server.del({path : path + '/' + resource + '/:resourceId' , version : version}, auth, deleteResourceById(dbResource));
		server.put({path : path + '/' + resource + '/:resourceId' , version : version}, auth, updateResourceById(dbResource));
	},
	login = function(dbResource) {
		return function(req, res , next){
			dbResource.findOne({$and:[ {email:req.params.email}, {pwd:req.params.pwd}]} , function(err , success){
				console.info('Response success '+success);
				console.log('Response error '+err);
				if(success){
					success.token = jwt.sign(success, options.jwtSecret);

					res.send(200 , success);
					return next();
				}
				res.send(404);
				return next(err);
			});
		};
	},
	logout = function() {
		return function(req, res , next){
			return next();
		};
	},
	checkSession = function() {
		return function(req, res , next){
			return next();
		};
	},
	init = function() {
		console.info('init');
		var resource = 'users',
		dbResource = db.collection(resource),
		validateUser = function(req, res, next) {
			if(req.params.email && req.params.pwd){
				return next();
			}
			res.send(404);
			return next(new restify.InvalidArgumentError("Required fields 'email', 'pwd', missing."));
		},
		validate = options.validateUser || validateUser;
		server.get({path : path + '/' + resource , version : version}, auth, findAllResources(dbResource));
		server.get({path : path + '/' + resource + '/:resourceId' , version : version}, auth, findResourceById(dbResource));
		server.get({path : path + '/' + resource +'/:prop/:value' , version : version}, auth, findResourceByProp(dbResource));
		server.post({path : path + '/' + resource , version: '0.0.1'}, validate, postNewResource(dbResource));
		server.del({path : path + '/' + resource + '/:resourceId' , version : version}, auth, deleteResourceById(dbResource));
		server.put({path : path + '/' + resource + '/:resourceId' , version : version}, auth, updateResourceById(dbResource));
		
		server.post({path : path + '/login' , version: '0.0.1'}, login(dbResource));
		server.post({path : path + '/logout' , version: '0.0.1'}, validate, logout(dbResource));
		server.post({path : path + '/checksession' , version: '0.0.1'}, validate, checkSession(dbResource));
	}();
	
	return addResource;
  
};
