var async = require('async');
        
function Manager(dependencies) {
    this.createUser = function(user, callback) {
        if (!user.name || !user.name.trim()) {
            return callback(new Error('Cannot create a user without a name.'));
        }
        var repository = dependencies.repository;
        repository.insert(user, function (error, affected) {
            callback(error, user);
        });
    }
}
exports.Manager = Manager;