var repositories = require('../../repositories/user.js');

// builds the view model needed by the index screen
function IndexBuilder(dependencies) {
    // builds the view model
    this.build = function(callback) {
        var repository = dependencies.repository;
        repository.getUsers(callback);
    }
}
exports.IndexBuilder = IndexBuilder;