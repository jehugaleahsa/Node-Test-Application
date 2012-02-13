var mongo = require('../mongo.js');
var async = require('async');

// provides access to the data needed by the home actions
function HomeRepository(settings) {

    // gets the user with the given ID
    // callback(error, user)
    this.getUser = function(id, callback) {
        var user = null;
        async.waterfall([
            function (callback) {
                var filter = { _id: mongo.getObjectId(id) };
                getUsersFiltered(settings, filter, callback);
            },
            function (users, callback) {
                if (users.length == 0) {
                    return callback(new Error('A user could not be found with the given ID.'));
                } else if (users.length > 1) {
                    return callback(new Error('More than one user was found with the given ID.'));
                }
                user = users[0];
                return callback(null);
            }
            ],
            function (error) {
                callback(error, user);
            });
    }

    // gets all of the users in the database, ordered by name
    // callback(error, users)
    this.getUsers = function(callback) {
        var filter = {};
        getUsersFiltered(settings, filter, callback);
    }

    // updates the user on the database
    this.update = function(user, callback) {
        var count = 0;
        async.waterfall([
            function (callback) {
                var server = new mongo.MongoServer(settings);
                var database = server.database('test');
                var collection = database.collection('user');
                var id = user.id;
                var replacement = { name: user.name };
                collection.update(id, replacement, callback);
            }
            ],
            function (error) {
                callback(error, count);
            });
    }
}
exports.HomeRepository = HomeRepository;

function getUsersFiltered(settings, filter, callback) {
    var users = null;
    async.waterfall([
        // grab the results from the database
        function (callback) {
            var server = new mongo.MongoServer(settings);
            var database = server.database('test');
            var collection = database.collection('user');
            var sort = [ [ 'name', 'asc' ] ];
            collection.find(filter, sort, callback);
        },
        // convert the results to user objects
        function (results, callback) {
            async.map(results, mapToUser, callback);
        },
        // store the users
        function (results, callback) {
            users = results;
            callback(null);
        }
        ],
        function (error) {
            // return the users
            callback(error, users);
        });
}

function mapToUser(source, callback) {
    var user = {
        id:   source._id,
        name: source.name
    };
    callback(null, user);
}