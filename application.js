var express = require('express');
var application = express.createServer();

// configure the environment
var configuration = require('./configuration');
var manager = new configuration.ConfigurationManager(application);
application.configure(manager.configure);

// configure the routes
var routing = require('./routing');
var router = new routing.Router(application);
router.registerRoutes();

// start listening
application.listen(3000);