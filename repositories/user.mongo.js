var mongo = require('../mongo.js');
var async = require('async');

// provides access to the data needed by the home actions
function HomeRepository(settings) {
    var server = new mongo.MongoServer(settings);
    var database = server.database('test');
    var collection = database.collection('user');

    // gets the user with the given ID
    // callback(error, user)
    this.getUser = function (id, callback) {
        var user = null;
        async.waterfall([
            function (callback) {
                var filter = { _id: mongo.getObjectId(id) };
                getUsersFiltered(collection, filter, callback);
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
    this.getUsers = function (callback) {
        var filter = {};
        getUsersFiltered(collection, filter, callback);
    }

    // updates the user on the database
    // user: the user information to update
    // callback(error, count)
    this.update = function (user, callback) {
        var count = 0;
        async.waterfall([
            function (callback) {
                var id = user.id;
                var replacement = { name: user.name };
                collection.update(id, replacement, callback);
            },
            function (affected, callback) {
                count = affected;
                callback(null);
            }
            ],
            function (error) {
                callback(error, count);
            });
    }
    
    // inserts the user in the database, adding the new ID to the object
    // user: the user information to insert
    // callback(error, count)
    this.insert = function (user, callback) {
        var count = 0;
        async.waterfall([
            function (callback) {
                collection.insert(user, callback);
            },
            function (inserted, callback) {
                user.id = inserted._id;
                count = 1;
                callback(null);
            }
            ],
            function (error) {
                callback(error, count);
            });
    }
    
    // removes the user from the database
    this.remove = function (userId, callback) {
        var count = 0;
        async.waterfall([
            function (callback) {
                var condition = { _id: mongo.getObjectId(userId) };
                collection.remove(condition, callback);
            },
            function (affected, error) {
                count = affected;
                callback(null);
            }
            ],
            function (error) {
                callback(error, count);
            });
    }
    
    // closes any resources held by the repository
    this.close = function () {
        database.close();
    }
}
exports.HomeRepository = HomeRepository;

function getUsersFiltered(collection, filter, callback) {
    var users = null;
    async.waterfall([
        // grab the results from the database
        function (callback) {
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