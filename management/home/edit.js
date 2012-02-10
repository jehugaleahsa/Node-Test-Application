var async = require('async');

// contains the logic associated with removing a user
function Manager(dependencies) {
    // updates the user with the given ID
    // user: the values of the user
    // callback(error): the callback to call when control returns from the data store
    this.update = function (user, callback) {
        var server = dependencies.mongo;
        var database = server.database('test');
        var collection = database.collection('user');
        async.waterfall([
            // update the user
            function (callback) {
                collection.update(user, callback);
            },
            // do something with the count
            function (count, callback) {
                callback(null);
            }
            ],
            function (error) {
                callback(error);
            });
    }
}
exports.Manager = Manager;