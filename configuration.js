// manages the configuration for the current environment
function ConfigurationManager(application) {
    
    // configures the application for the given environment
    this.configure = function() {
        // configure the different environments
        var settings = {};
        application.configure(function() { shared(application, settings) });
        application.configure('production', function() { production(application, settings) });
        application.configure('development', function() { development(application, settings) });
        return settings;
    }
}

// holds the configuration settings shared across environments
// application: the application being configured
// settings: a collection to store environment settings
function shared(application, settings) {
    var express = require('express');
    application.use(express.bodyParser());
    application.set('view engine', 'jade');
    application.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
    application.use(express.static(__dirname + '/public'));
}

// configures the application for the development environment
// application: the application being configured
// settings: a collection to store environment settings
function development(application, settings) {
    console.log('Configuring Node for development');
    var express = require('express');
    application.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    
    // mongo settings 
    settings['Mongo Host'] = '127.0.0.1';
    settings['Mongo Port'] = 27017;
    settings['Mongo Server Options'] = {};
    settings['Mongo Database Name'] = 'test';
    settings['Mongo Database Options'] = {};
    
    // MySQL settings
    settings['MySql Host'] = 'localhost';
    settings['MySql Port'] = 3306;
    settings['MySql User'] = 'root';
    settings['MySql Password'] = 'testing123';
}

// configures the application for the production environment
// application: the application being configured
// settings: a collection to store environment settings
function production(application, settings) {
    console.log('Configuring Node for production');
    var express = require('express');
    application.use(express.errorHandler());
}

exports.ConfigurationManager = ConfigurationManager;