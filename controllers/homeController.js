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
                    layout: false,
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
                            layout: false,
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
}
exports.HomeController = HomeController;

