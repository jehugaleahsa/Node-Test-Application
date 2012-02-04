// get any command line options
var optimist = require('optimist');
var arguments = optimist.argv;

// create the HTTP server
var express = require('express');
var application = express.createServer();

// configure the environment
var configuration = require('./configuration');
var manager = new configuration.ConfigurationManager(application);
manager.configure();

// configure the routes
var routing = require('./routing');
var router = new routing.Router(application);
router.registerRoutes();

// start listening
application.listen(3000);

// trying a mongo query
var mongo = require('mongodb');
var mongoServer = new mongo.Server("127.0.0.1", 27017, {});
var client = new mongo.Db('test', mongoServer);
var async = require('async');
async.waterfall([
    // open the connection
    function(callback) {
        console.log('Connecting to MongoDb...');
        client.open(callback);
    },
    // open the user collection
    function(database, callback) {
        console.log('Connecting to the users collection...');
        database.collection('user', callback);
    },
    // get all the users
    function(collection, callback) {
        console.log('Finding all the users...');
        var cursor = collection.find({}); // find all
        cursor.toArray(callback);
    },
    // printing all the users
    function(documents, callback) {
        async.forEach(documents, function(document, callback) {
            console.log(document);
            callback(null);
        }, callback);
    }],
    // report errors and close the connection
    function(error) {
        if (error) {
            console.log(error);
        }        
        console.log('Closing the connection...');
        client.close();
    }
);