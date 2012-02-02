function ConfigurationManager(application) {
	this.configure = function() {
		var express = require('express');
		application.use(express.bodyParser());
		application.set('view engine', 'jade');
	}
}
exports.ConfigurationManager = ConfigurationManager;