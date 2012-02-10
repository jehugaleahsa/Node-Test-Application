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

// configure the routes
var routing = require('./routing');
var router = new routing.Router(application);
router.registerRoutes(settings);

// start listening
application.listen(3000);