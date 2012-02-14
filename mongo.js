var mongo = require('mongodb');
var async = require('async');

// provides access to a MongDB server
// settings: holds settings needed to connect to MongoDB.
function MongoServer(settings) {
    var mongoHost = settings['Mongo Host'];
    var mongoPort = settings['Mongo Port'];
    var mongoOptions = settings['Mongo Server Options'];
    var mongoServer = new mongo.Server(mongoHost, mongoPort, mongoOptions);

    var proxies = {};
    var databases = {};
    
    // opens the database with the given name
    // name: the name of the database
    this.database = function(name) {
        var proxy = null;
        if (name in proxies) {
            proxy = proxies[name];
        } else {
            proxy = new MongoDatabase(this, name);
            proxies[name] = proxy;
        }
        return proxy;
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
    var proxies = {};
    var collections = {};
    
    // open the collection with the given name
    // name: the name of the collection to open
    this.collection = function(name) {
        var collection = null;
        if (name in proxies) {
            collection = proxies[name];
        } else {
            collection = new MongoCollection(this, name);
            proxies[name] = collection;
        }
        return collection;
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
    // sort: an array of sort conditions
    // callback(error, documents): the callback to pass the errors and returned documents to
    this.find = function(condition, sort, callback) {
        if (typeof callback === 'undefined') {
            callback = sort;
            sort = [];
        }
        var result = null;
        async.waterfall([
            // retrieve the collection
            function (callback) { database._open(name, callback); },
            // retrieve the documents
            function (collection, callback) {
                var options = { sort: sort };
                var cursor = collection.find(condition, options);
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
    
    // inserts the given document
    this.insert = function(document, callback) {
        var inserted = null;
        async.waterfall([
            // retrieve the collection
            function (callback) { database._open(name, callback); },
            // retrieve the documents
            function (collection, callback) {
                var options = { safe: true };
                collection.insert(document, options, callback);
            },
            // grab the inserted document
            function (documents, callback) {
                inserted = documents[0];
                callback(null);
            }
            ],
            // call the callback, passing any errors
            function (error) {
                callback(error, inserted);
            });
    }
    
    // updates the documents satisfying the condition by replacing it
    // id: the ID of the value to update
    // replacement: the replacement values, excluding its ID field.
    // callback(error): the callback to pass the errors to
    this.update = function(id, replacement, callback) {
        var affected = 0;
        async.waterfall([
            // open the collection
            function (callback) { database._open(name, callback); },
            // update the document
            function (collection, callback) {
                var condition = { _id: getObjectId(id) };
                // clone the document, except the _id
                var options = { safe: true, multi: false, upsert: false };
                collection.update(condition, replacement, options, callback);
            },
            function (count, callback) {
                affected = count;
                callback(null);
            }
            ],
            function (error) {
                callback(error, affected);
            });
    }

    // removes the documents satisfying the given condition
    // condition: the condition that the documents must satify in order to be removed
    // callback(error): the callback to pass the errors to
    this.remove = function(condition, callback) {
        var affected = 0;
        async.waterfall([
            // retrieve the collection
            function (callback) { 
                database._open(name, callback); 
            },
            // retrieve the documents
            function (collection, callback) {
                var options = { safe: true };
                collection.remove(condition, options, callback);
            },
            function (count, callback) {
                affected = count;
                callback(null);
            }
            ],
            // call the callback, passing any errors
            function (error) {
                callback(error, affected);
            });
    }
}

exports.MongoServer = MongoServer;

function getObjectId(id) {
    var objectId = new mongo.ObjectID(id);
    return objectId;
}
exports.getObjectId = getObjectId;