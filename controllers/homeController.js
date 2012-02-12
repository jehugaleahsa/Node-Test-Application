var async = require('async');

// renders views and performs business logic associated with the home pages
function HomeController(dependencies) {
    // when the user navigates to the home page,
    // they should be shown all of the current users
    this.index = function(request, response, next) {
        async.waterfall([
            // build the view model
            function (callback) { 
                var builders = require('../view_management/home/index.js');
                var builder = new builders.IndexBuilder(dependencies);
                builder.build(callback);
            },
            // render the view
            function (users, callback) {
                var options = {
                    locals: { users : users }
                };
                response.render('home/index', options);
                callback(null);
            }
            ],
            function (error) {
                next(error);
            });
    }
    
    // when the user wants to remove a user,
    // they should be prompted to confirm their decision
    this.remove = function(request, response, next) {
        async.waterfall([
            // build the view model
            function (callback) {
                var builders = require('../view_management/home/remove.js');
                var builder = new builders.RemoveBuilder(dependencies);
                var userId = request.params.id;
                builder.build(userId, callback);
            },
            // render the view
            function (users, callback) {
                if (users.length != 1) {
                    return callback('More the one user was found with the given ID.');
                }
                var options = {
                    locals: { user: users[0] }
                };
                response.render('home/remove', options);
                return callback(null);
            }
        ],
        function (error) {
            next(error);
        });
    }

    // when the user confirms that they want to remove a user,
    // the user should be removed from the data store
    // and the user should be redirected to the index screen
    this.removePost = function(request, response, next) {
        async.waterfall([
            // remove the user from the data store
            function (callback) {
                var managers = require('../management/home/remove.js');
                var manager = new managers.Manager(dependencies);
                var userId = request.body.id;
                manager.removeUser(userId, callback);
            },
            // redirect the user to the index
            function (callback) { 
                response.redirect('/home/index');
                callback(null);
            }
            ],
            function (error) {
                next(error);
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
                response.render('home/create', options);
                callback(null);
            }
            ],
            function (error) {
                next(error);
            });
    }

    // when the user enters in user information,
    // a user should be added to the data store
    this.createPost = function(request, response, next) {
        async.waterfall([
            // create and store the user on the database
            function (callback) {
                var managers = require('../management/home/create.js');
                var manager = new managers.Manager(dependencies);
                var user = { name: request.body.name };
                manager.createUser(user, callback);
            },
            // redirect the user to the index
            function (user, callback) {
                response.redirect('/home/index');
                callback(null);
            }
            ],
            function (error) {
                next(error);
            });
    }

    // when the user wants to edit a user,
    // they should be allowed to edit fields
    this.edit = function(request, response, next) {
        async.waterfall([
            // retrieve the user information from the database
            function (callback) {
                var builders = require('../view_management/home/edit.js');
                var builder = new builders.EditBuilder(dependencies);
                var userId = request.params.id;
                builder.build(userId, callback);
            },
            // render the view
            function (users, callback) {
                if (users.length != 1) {
                    return callback('More the one user was found with the given ID.');
                }
                var options = {
                    locals: { user: users[0] }
                };
                response.render('home/edit', options);
                return callback(null);
            }
            ],
            function (error) {
                next(error);
            });
    }
    
    // when the user submits their changes,
    // the data store should be updated
    this.editPost = function(request, response, next) {
        async.waterfall([
            // update the user on the data store
            function (callback) {
                var user = {
                    _id: request.body.id,
                    name: request.body.name
                };
                var managers = require('../management/home/edit.js');
                var manager = new managers.Manager(dependencies);
                manager.update(user, callback);
            },
            function (callback) {
                response.redirect('/home/index');
                callback(null);
            }
            ],
            function (error) {
                next(error);
            });
    }
}
exports.HomeController = HomeController;

