// configures all the routes in the application
function Router(application) {
    // registers each route in the application
    this.registerRoutes = function(mongoServer) {
        registerHome(application, mongoServer);
    }
}

// registers the routes associated with the home controller
function registerHome(application, mongoServer) {
    var homeController = require('./controllers/homeController');
    var dependencies = {
        mongo: mongoServer
    };
    var controller = new homeController.HomeController(dependencies);
    application.get('/', controller.index);
    application.get('/home/index', controller.index);
    application.get('/home/remove/:id', controller.remove);
}

exports.Router = Router;