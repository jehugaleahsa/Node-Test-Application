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
        application.configure(environment);
    }
    
    // holds the configuration settings shared across environments
    function shared() {
        var express = require('express');
        application.use(express.bodyParser());
        application.set('view engine', 'jade');
    }
    
    // configures the application for the development environment
    function development() {
        console.log('Configuring Node for development');
        shared();
    }
    
    // configures the application for the production environment
    function production() {
        console.log('Configuring Node for production');
        shared();
    }
}
exports.ConfigurationManager = ConfigurationManager;