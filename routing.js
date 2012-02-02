function Router(application) {
	this.registerRoutes = function() {
		registerHome(application);
	}
}

function registerHome(application) {
	var homeController = require('./controllers/homeController');
	application.get('/', homeController.index);
    application.get('/home/index', homeController.index);
    application.post('/', homeController.indexPost);
    application.post('/home/index', homeController.indexPost);
}

exports.Router = Router;