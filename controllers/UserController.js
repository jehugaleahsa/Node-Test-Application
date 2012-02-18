var async = require('async');

// renders views and performs business logic associated with the user pages
function UserController(manager) {
    // when the user navigates to the user page,
    // they should be shown all of the current users
    this.index = function(request, response, next) {
        var dependencies = manager.getDependencies();
        async.waterfall([
            // build the view model
            function(callback) { 
                var builders = require('../view_management/user/index.js');
                var builder = new builders.IndexBuilder(dependencies);
                builder.build(callback);
            },
            // render the view
            function(users, callback) {
                var options = {
                    locals: { users : users }
                };
                response.render('user/index', options);
                callback(null);
            }
            ],
            function(error) {
                manager.release();
                if (error) {
                    next(error); 
                }                
            });
    }
    
    // when the user wants to remove a user,
    // they should be prompted to confirm their decision
    this.remove = function(request, response, next) {
        var dependencies = manager.getDependencies();
        async.waterfall([
            // build the view model
            function (callback) {
                var builders = require('../view_management/user/remove.js');
                var builder = new builders.RemoveBuilder(dependencies);
                var userId = request.params.id;
                builder.build(userId, callback);
            },
            // render the view
            function (user, callback) {
                var options = {
                    locals: { user: user }
                };
                response.render('user/remove', options);
                callback(null);
            }
        ],
        function (error) {
            manager.release();
            if (error) { 
                next(error); 
            }
        });
    }

    // when the user confirms that they want to remove a user,
    // the user should be removed from the data store
    // and the user should be redirected to the index screen
    this.removePost = function(request, response, next) {
        var dependencies = manager.getDependencies();
        async.waterfall([
            // remove the user from the data store
            function (callback) {
                var managers = require('../management/user/remove.js');
                var manager = new managers.Manager(dependencies);
                var userId = request.body.id;
                manager.removeUser(userId, callback);
            },
            // redirect the user to the index
            function (callback) { 
                response.redirect('/user/index');
                callback(null);
            }
            ],
            function (error) {
                manager.release();
                if (error) { 
                    next(error); 
                }
            });
    }
    
    // when the user wants to create a new user,
    // they should be prompted to provide information
    this.create = function(request, response, next) {
        async.waterfall([
            function (callback) {
                var options = {
                    locals: null
                };
                response.render('user/create', options);
                callback(null);
            }
            ],
            function (error) {
                if (error) { 
                    next(error); 
                }
            });
    }

    // when the user enters in user information,
    // a user should be added to the data store
    this.createPost = function(request, response, next) {
        var dependencies = manager.getDependencies();
        async.waterfall([
            // create and store the user on the database
            function (callback) {
                var managers = require('../management/user/create.js');
                var manager = new managers.Manager(dependencies);
                var user = { name: request.body.name };
                manager.createUser(user, callback);
            },
            // redirect the user to the index
            function (user, callback) {
                response.redirect('/user/index');
                callback(null);
            }
            ],
            function (error) {
                manager.release();
                if (error) { 
                    next(error); 
                }
            });
    }

    // when the user wants to edit a user,
    // they should be allowed to edit fields
    this.edit = function(request, response, next) {
        var dependencies = manager.getDependencies();
        async.waterfall([
            // retrieve the user information from the database
            function (callback) {
                var builders = require('../view_management/user/edit.js');
                var builder = new builders.EditBuilder(dependencies);
                var userId = request.params.id;
                builder.build(userId, callback);
            },
            // render the view
            function (user, callback) {
                var options = {
                    locals: { user: user }
                };
                response.render('user/edit', options);
                return callback(null);
            }
            ],
            function (error) {
                manager.release();
                if (error) { 
                    next(error); 
                }
            });
    }
    
    // when the user submits their changes,
    // the data store should be updated
    this.editPost = function(request, response, next) {
        var dependencies = manager.getDependencies();
        async.waterfall([
            // update the user on the data store
            function (callback) {
                var user = {
                    id: request.body.id,
                    name: request.body.name
                };
                var managers = require('../management/user/edit.js');
                var manager = new managers.Manager(dependencies);
                manager.update(user, callback);
            },
            function (updateCount, callback) {
                response.redirect('/user/index');
                callback(null);
            }
            ],
            function (error) {
                manager.release();
                if (error) { 
                    next(error); 
                }
            });
    }
}
exports.UserController = UserController;

