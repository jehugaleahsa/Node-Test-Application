// renders views and performs business logic associated with the home pages
function HomeController(dependencies) {
    // when the user navigates to the home page,
    // they should be shown all of the current users
    this.index = function(request, response) {
        var async = require('async');
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
                    layout: 'layout',
                    locals: { users : users }
                };
                response.render('home/index', options);
                callback(null);
            }
            ],
            function (error) {
                if (error) {
                    // indicate that an error occurred
                }
            });
    }
    
    // when the user wants to remove a user,
    // they should be prompted to confirm their decision
    this.remove = function(request, response) {
        var userId = request.params.id;
        var async = require('async');
        async.waterfall([
                // build the view model
                function (callback) {
                    var builders = require('../view_management/home/remove.js');
                    var builder = new builders.RemoveBuilder(dependencies);
                    builder.build(userId, callback);
                },
                // render the view
                function (users, callback) {
                    if (users.length != 1) {
                        callback('More the one user was found with the given ID.');
                    } else {
                        var options = {
                            layout: 'layout',
                            locals: { user : users[0] }
                        };
                        response.render('home/remove', options);
                        callback(null);
                    }
                }
            ],
            function (error) {
                if (error) {
                    // indicate that an error occurred
                }
            });
    }

    // when the user confirms that they want to remove a user,
    // the user should be removed from the data store
    // and the user should be redirected to the index screen
    this.removePost = function(request, response) {
        var userId = request.body.id;
        var async = require('async');
        async.waterfall([
            // remove the user from the data store
            function (callback) {
                var managers = require('../management/home/remove.js');
                var manager = new managers.Manager(dependencies);
                manager.removeUser(userId, callback);
            },
            // redirect the user to the index
            function (callback) { 
                response.redirect('/home/index');
                callback(null);
            }
            ],
            function (error) {
                if (error) {
                    // indicate that an error occurred
                }
            });
    }
    
    // when the user wants to create a new user,
    // they should be prompted to provide information
    this.create = function(request, response) {
        var async = require('async');
        async.waterfall([
            function (callback) {
                var options = {
                    layout: 'layout',
                    locals: null
                };
                response.render('home/create', options);
                callback(null);
            }
            ],
            function (error) {
            });
    }
}
exports.HomeController = HomeController;

