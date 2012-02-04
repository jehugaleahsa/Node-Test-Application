// manages the configuration for the current environment
function ConfigurationManager(application) {
    var environments = { 
        'dev': development,
        'prod': production
    };
    
    // configures the application for the given environment
    // build: the environment to configure
    this.configure = function(build) {
        // grab the environment by name, or development by default
        var environment = environments[build] || development;
        application.configure(function() { environment(application) });
    }
}

// holds the configuration settings shared across environments
// application: the application being configured
function shared(application) {
    var express = require('express');
    application.use(express.bodyParser());
    application.set('view engine', 'jade');
}

// configures the application for the development environment
// application: the application being configured
function development(application) {
    console.log('Configuring Node for development');
    shared(application);
}

// configures the application for the production environment
// application: the application being configured
function production(application) {
    console.log('Configuring Node for production');
    shared(application);
}

exports.ConfigurationManager = ConfigurationManager;