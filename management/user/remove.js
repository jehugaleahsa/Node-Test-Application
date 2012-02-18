// contains the logic associated with removing a user
function Manager(dependencies) {
    // removes the user with the given ID
    // userId: the ID of the user to remove
    // callback(error): the callback to call when control returns from the data store
    this.removeUser = function (userId, callback) {
        var repository = dependencies.repository;
        repository.remove(userId, callback);
    }
}

exports.Manager = Manager;