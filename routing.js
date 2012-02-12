var homeController = require('./controllers/homeController');
var mongo = require('./mongo');
    
// configures all the routes in the application
function Router(application) {
    // registers each route in the application
    this.registerRoutes = function(settings) {
        registerHome(application, settings);
        
        // handle bad URLs
        application.get('/404', function(request, response) {
            response.render('404'); // maybe pass request.url
        });
        // catch bad URLs
        application.use(function(request, response) {
            response.redirect('/404');
        });
        // catch errors
        application.error(function(error, request, response, next) {
            response.render('500', { layout: false, locals: { error: error } });
            next(error); // let the middleware report the error
        });
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