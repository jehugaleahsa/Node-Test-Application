// get any command line options
var optimist = require('optimist');
var argv = optimist.default({build: 'dev'})
                   .argv;

// create the HTTP server
var express = require('express');
var application = express.createServer();

// configure the environment
var configuration = require('./configuration');
var manager = new configuration.ConfigurationManager(application);
var build = argv.build;
manager.configure(build);

// configure the routes
var routing = require('./routing');
var router = new routing.Router(application);
router.registerRoutes();

// start listening
application.listen(3000);