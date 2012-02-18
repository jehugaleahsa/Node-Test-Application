var userController = require('./controllers/userController');
var mongo = require('./mongo');
    
// configures all the routes in the application
function Router(application) {
    // registers each route in the application
    this.registerRoutes = function(settings) {
        registerUser(application, settings);
        
        // handle bad URLs
        application.get('/404', function(request, response) {
            var options = { layout: false };
            response.render('404', options); // maybe pass request.url
        });
        // catch bad URLs
        application.use(function(request, response) {
            response.redirect('/404');
        });
        // catch errors
        application.error(function(error, request, response, next) {
            var options = {
                layout: false,
                locals: { error: error }
            };
            response.render('500', options);
            next(error); // let the middleware report the error
        });
    }
}

// registers the routes associated with the user controller
function registerUser(application, settings) {
    var manager = new UserResourceManager(settings);
    var controller = new userController.UserController(manager);
    application.get('/', controller.index);
    application.get('/user', controller.index);
    application.post('/user/:id/details', controller.getDetails);
    application.get('/user/:id/remove', controller.remove);
    application.del('/user', controller.removePost);
    application.get('/user/create', controller.create);
    application.post('/user', controller.createPost);
    application.get('/user/:id/edit', controller.edit);
    application.put('/user', controller.editPost);
}

function UserResourceManager(settings) {        
    var repository = null;
    
    this.getDependencies = function() {
        if (!repository) {
            var repositories = require('./repositories/user.js');
            repository = new repositories.HomeRepository(settings); // set cache
        }
        var dependencies = { repository: repository };
        return dependencies;
    }
    
    this.release = function() {
        if (repository) {
            repository.close();
            repository = null; // clear cache
        }
    }
}

exports.Router = Router;