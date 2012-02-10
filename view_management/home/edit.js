function EditBuilder(dependencies) {
    this.build = function(userId, callback) {
        var server = dependencies.mongo;
        var database = server.database('test');
        var collection = database.collection('user');
        collection.find({_id: server.objectId(userId)}, callback);
    }
}
exports.EditBuilder = EditBuilder;