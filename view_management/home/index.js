function IndexBuilder(dependencies) {
    this.build = function(callback) {
        var server = dependencies.mongo;
        var database = server.database('test');
        var collection = database.collection('user');
        var filter = {};
        var sort = { name: 'asc' };
        collection.find(filter, sort, callback);
    }
}

exports.IndexBuilder = IndexBuilder;