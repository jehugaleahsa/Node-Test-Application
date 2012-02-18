var mysql = require('../mysql.js');
var async = require('async');

// provides access to the data needed by the home actions
function HomeRepository(settings) {
    var client = new mysql.MySqlClient(settings);

    // gets the user with the given ID
    // callback(error, user)
    this.getUser = function (id, callback) {
        var user = null;
        async.waterfall([
            function (callback) {
                var query = 'SELECT id, name FROM test.user WHERE id = ?';
                var parameters = [+id];
                client.select(query, parameters, callback);
            },
            function (rows, columns, callback) {
                if (rows.length == 0) {
                    return callback(new Error('A user could not be found with the given ID.'));
                } else if (rows.length > 1) {
                    return callback(new Error('More than one user was found with the given ID.'));
                }
                var row = rows[0];
                user = { id: row.id, name: row.name };
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
        var users = null;
        async.waterfall([
            function (callback) {
                var query = 'SELECT id, name FROM test.user ORDER BY name';
                var parameters = [];
                client.select(query, parameters, callback);
            },
            function (rows, columns, callback) {
                async.map(rows, mapToUser, callback);
            },
            function (results, callback) {
                users = results;
                callback(null);
            }
            ],
            function (error) {
                callback(error, users);
            });
    }

    // updates the user on the database
    // user: the user information to update
    // callback(error, count)
    this.update = function (user, callback) {
        var count = 0;
        async.waterfall([
            function (callback) {
                var statement = 'UPDATE test.user SET name = ? WHERE id = ?';
                var parameters = [user.name, +user.id];
                client.update(statement, parameters, callback);
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
                var statement = 'INSERT INTO test.user (name) VALUES(?)';
                var parameters = [user.name];
                client.insert(statement, parameters, callback);
            },
            function (id, affected, callback) {
                user.id = id;
                count = affected;
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
                var statement = 'DELETE FROM test.user WHERE id = ?';
                var parameters = [+userId];
                client.remove(statement, parameters, callback);
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
        client.close();
    }
}
exports.HomeRepository = HomeRepository;

function mapToUser(source, callback) {
    var user = {
        id:   source.id,
        name: source.name
    };
    callback(null, user);
}