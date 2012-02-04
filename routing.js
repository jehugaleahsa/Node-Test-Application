// configures all the routes in the application
function Router(application) {

    // registers each route in the application
    this.registerRoutes = function() {
        registerHome(application);
    }
}

// registers the routes associated with the home controller
function registerHome(application) {
    var homeController = require('./controllers/homeController');
    application.get('/', homeController.index);
    application.get('/home/index', homeController.index);
    application.post('/', homeController.indexPost);
    application.post('/home/index', homeController.indexPost);
}

exports.Router = Router;