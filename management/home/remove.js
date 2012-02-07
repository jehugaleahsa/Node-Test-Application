// contains the logic associated with removing a user
function Manager(dependencies) {
    // removes the user with the given ID
    // userId: the ID of the user to remove
    // callback(error): the callback to call when control returns from the data store
    this.removeUser = function (userId, callback) {
        var server = dependencies.mongo;
        var database = server.database('test');
        var collection = database.collection('user');
        collection.remove({_id: server.objectId(userId)}, callback);
    }
}
exports.Manager = Manager;