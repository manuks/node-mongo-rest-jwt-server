var mongojs = require("mongojs");
module.exports = function(resource, options) {
  'use strict';
  if (!resource) {
    throw new Error('resource should be set');
  }
  if (!options || !options.server) {
    throw new Error('server should be set');
  }
  if (!options || !options.db) {
    throw new Error('db should be set');
  }
  var server = options.server,
	path = options.path,
	version = options.version || '0.0.1',
	auth = options.auth || function (req, res, next) {next();},
	db = options.db,
	dbResource = db.collection(resource),
	findAllResources = function(dbResource) {
		
		return function(req, res , next){
			
			dbResource.find().limit(20).sort({postedOn : 1} , function(err , success){
				console.log('Response success '+success);
				console.log('Response error '+err);
				if(success && success.length){
					console.log('success');
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
				console.log('Response success '+success);
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
	deleteResourceById = function(dbResource) {

		return function(req, res , next){
			dbResource.remove({_id:mongojs.ObjectId(req.params.resourceId)} , function(err , success){
				console.log('Response success '+success);
				console.log('Response error '+err);
				if(success && success.n){
					console.log(success);
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
	};
  server.get({path : path + '/' + resource , version : version}, auth, findAllResources(dbResource));
  server.get({path : path + '/' + resource + '/:resourceId' , version : version}, auth, findResourceById(dbResource));
  server.post({path : path + '/' + resource , version: '0.0.1'}, auth, postNewResource(dbResource));
  server.del({path : path + '/' + resource + '/:resourceId' , version : version}, auth, deleteResourceById(dbResource));
  server.put({path : path + '/' + resource + '/:resourceId' , version : version}, auth, updateResourceById(dbResource));
  
};
