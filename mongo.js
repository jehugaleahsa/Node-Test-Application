var mongo = require('mongodb');
var async = require('async');

// provides access to a MongDB server
// settings: holds settings needed to connect to MongoDB.
function MongoServer(settings) {
    var mongoHost = settings['Mongo Host'];
    var mongoPort = settings['Mongo Port'];
    var mongoOptions = settings['Mongo Server Options'];
    var mongoServer = new mongo.Server(mongoHost, mongoPort, mongoOptions);

    var databases = {};
    
    // opens the database with the given name
    // name: the name of the database
    this.database = function(name) {
        return new MongoDatabase(this, name);
    }
    
    this._open = function(databaseName, callback) {
        if (databaseName in databases) {
            // grab a cached database
            var database = databases[databaseName];
            callback(null, database);
        } else {
            // open a new database
            var client = new mongo.Db(databaseName, mongoServer);
            client.open(function (error, database) {
                // cache the database, unless there's an error
                if (!error) {
                    databases[databaseName] = database;
                }
                callback(error, database);
            });
        }
    }
    
    this._close = function(databaseName) {
        if (databaseName in databases) {
            var database = databases[databaseName];
            database.close();
            delete databases[databaseName];
        }
    }
}

function MongoDatabase(server, name) {
    var collections = {};
    
    // open the collection with the given name
    // name: the name of the collection to open
    this.collection = function(name) {
        return new MongoCollection(this, name);
    }
    
    // closes the database
    this.close = function() {
        server._close(name);
    }
    
    this._open = function(collectionName, callback) {
        if (collectionName in collections) {
            var collection = collections[collectionName];
            callback(null, collection);
        } else {
            async.waterfall([
                // retrieve the database
                function (callback) { server._open(name, callback); },
                // retrieve the collection
                function (database, callback) { database.collection(collectionName, callback); },
                // cache the collection
                function (collection, callback) {                     
                    collections[collectionName] = collection;
                    callback(null);
                }
                ],
                function (error) {
                    var collection = null;
                    if (!error) {
                        collection = collections[collectionName];
                    }
                    callback(error, collection);
                });
        }
    }
}

function MongoCollection(database, name) {
    // finds the documents satisifying the given condition, passing them to the given callback
    // condition: the condition that the documents must satisfy
    // callback(error, documents): the callback to pass the errors and returned documents to
    this.find = function(condition, callback) {
        var result = null;
        async.waterfall([
            // retrieve the collection
            function (callback) { database._open(name, callback); },
            // retrieve the documents
            function (collection, callback) {
                var cursor = collection.find(condition);
                cursor.toArray(callback);
            },
            // store the documents as the result
            function (documents, callback) {
                result = documents;
                callback(null);
            }
            ],
            // call the callback, passing any errors
            function (error) {
                callback(error, result);
            });
    }
}

exports.MongoServer = MongoServer;