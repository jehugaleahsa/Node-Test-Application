// get any command line options
var optimist = require('optimist');
var arguments = optimist.argv;

// create the HTTP server
var express = require('express');
var application = express.createServer();

// configure the environment
var configuration = require('./configuration');
var manager = new configuration.ConfigurationManager(application);
var settings = manager.configure();

// create a mongo server proxy
var mongo = require('./mongo');
var mongoServer = new mongo.MongoServer(settings);

// configure the routes
var routing = require('./routing');
var router = new routing.Router(application);
router.registerRoutes(mongoServer);

// start listening
application.listen(3000);

/* // try to use our new mongo library
var database = mongoServer.database('test');
var collection = database.collection('user');
collection.find({}, 
    function(error, documents) {
        if (error) {
            console.log(error);
        } else {
            var async = require('async');
            async.forEach(documents, 
                function (document, callback) { 
                    console.log(document);
                    callback(null);
                },
                function (error) {
                    database.close();
                });
        }
    }); */