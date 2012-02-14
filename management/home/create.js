var async = require('async');
        
function Manager(dependencies) {
    this.createUser = function(user, callback) {
        if (!user.name || !user.name.trim()) {
            return callback(new Error('Cannot create a user without a name.'));
        }
        var repository = dependencies.repository;
        return repository.insert(user, callback);
    }
}
exports.Manager = Manager;