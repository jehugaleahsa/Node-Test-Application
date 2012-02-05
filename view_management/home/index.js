function IndexBuilder(dependencies) {
    this.build = function(callback) {
        var server = dependencies.mongo;
        var database = server.database('test');
        var collection = database.collection('user');
        collection.find({}, callback);
    }
}

exports.IndexBuilder = IndexBuilder;