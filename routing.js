var homeController = require('./controllers/homeController');
var mongo = require('./mongo');
    
// configures all the routes in the application
function Router(application) {
    // registers each route in the application
    this.registerRoutes = function(settings) {
        registerHome(application, settings);
    }
}

// registers the routes associated with the home controller
function registerHome(application, settings) {
    var dependencies = {
        mongo: new mongo.MongoServer(settings)
    };
    var controller = new homeController.HomeController(dependencies);
    application.get('/', controller.index);
    application.get('/home/index', controller.index);
    application.get('/home/remove/:id', controller.remove);
    application.post('/home/remove', controller.removePost);
    application.get('/home/create', controller.create);
    application.post('/home/create', controller.createPost);
    application.get('/home/edit/:id', controller.edit);
    application.post('/home/edit', controller.editPost);
}

exports.Router = Router;