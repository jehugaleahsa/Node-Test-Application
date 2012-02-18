function EditBuilder(dependencies) {
    this.build = function(userId, callback) {
        var repository = dependencies.repository;
        repository.getUser(userId, callback);
    }
}
exports.EditBuilder = EditBuilder;