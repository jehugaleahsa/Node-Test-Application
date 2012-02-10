var async = require('async');
        
function Manager(dependencies) {
    this.createUser = function(user, callback) {
        var inserted = null;
        async.waterfall([
            // check that the user information is valid
            function (callback) {
                return callback(null);
            },
            // attempt to insert the user
            function (callback) {
                var server = dependencies.mongo;
                var database = server.database('test');
                var collection = database.collection('user');
                collection.insert(user, callback);
            },
            // grab the inserted user
            function (user, callback) {
                inserted = user;
                callback(null);
            }
            ],
            function (error) {
                // respond with the inserted user information
                callback(error, inserted);
            });
    }
}
exports.Manager = Manager;