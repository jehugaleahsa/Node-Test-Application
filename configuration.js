// manages the configuration for the current environment
function ConfigurationManager(application) {
    
    // configures the application for the given environment
    this.configure = function() {
        application.configure(function() { shared(application) });
        application.configure('production', function() { production(application) });
        application.configure('development', function() { development(application) });
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
}

// configures the application for the production environment
// application: the application being configured
function production(application) {
    console.log('Configuring Node for production');
}

exports.ConfigurationManager = ConfigurationManager;