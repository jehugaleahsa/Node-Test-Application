var userController = require('./controllers/userController');
var mongo = require('./mongo');
    
// configures all the routes in the application
function Router(application) {
    // registers each route in the application
    this.registerRoutes = function(settings) {
        registerUser(application, settings);
        
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

// registers the routes associated with the user controller
function registerUser(application, settings) {
    var manager = new UserResourceManager(settings);
    var controller = new userController.UserController(manager);
    application.get('/', controller.index);
    application.get('/user/index', controller.index);
    application.get('/user/remove/:id', controller.remove);
    application.post('/user/remove', controller.removePost);
    application.get('/user/create', controller.create);
    application.post('/user/create', controller.createPost);
    application.get('/user/edit/:id', controller.edit);
    application.post('/user/edit', controller.editPost);
}

function UserResourceManager(settings) {        
    var repository = null;
    
    this.getDependencies = function() {
        if (!repository) {
            var repositories = require('./repositories/user.js');
            repository = new repositories.HomeRepository(settings);
        }
        var dependencies = { repository: repository };
        return dependencies;
    }
    
    this.release = function() {
        if (repository) {
            repository.close();
        }
    }
}

exports.Router = Router;