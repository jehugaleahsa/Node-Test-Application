var async = require('async');

// contains the logic associated with removing a user
function Manager(dependencies) {
    // updates the user with the given ID
    // user: the values of the user
    // callback(error): the callback to call when control returns from the data store
    this.update = function (user, callback) {
        var repository = dependencies.repository;
        repository.update(user, callback);
    }
}
exports.Manager = Manager;