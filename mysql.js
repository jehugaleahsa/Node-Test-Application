var mysql = require('mysql');

// Allows performing actions on a MySQL database
// settings: holds the settings needed to connect to MySQL
function MySqlClient(settings) {
    
    var client = (function () {
        var options = {};
        options.host = settings['MySql Host'] || 'localhost';
        options.port = settings['MySql Port'] || 3306;
        options.user = settings['MySql User'];
        options.password = settings['MySql Password'];
        return mysql.createClient(options);
        })();
    
    // performs a query on the database
    // callback(error, rows, columns)
    this.select = function(query, parameters, callback) {
        client.query(query, parameters, callback);
    }
    
    // performs an insert on the database
    // callback(error, id, rowsAffected)
    this.insert = function(statement, parameters, callback) {
        client.query(statement, parameters, function(error, information) {
            if (error) {
                callback(error, null, 0);
            } else {
                callback(error, information.insertId, information.affectedRows);
            }
        });
    }
    
    // performs an update on the database
    // callback(error, rowsAffected)
    this.update = function(statement, parameters, callback) {
        client.query(statement, parameters, function(error, information) {
            if (error) {
                callback(error, 0);
            } else {
                callback(error, information.affectedRows);
            }
        });
    }
    
    // performs a delete on a database
    // callback(error, rowsAffected)
    this.remove = function(statement, parameters, callback) {
        client.query(statement, parameters, function(error, information) {
            if (error) {
                callback(error, 0);
            } else {
                callback(error, information.affectedRows);
            }
        });
    }
    
    // closes the connection to the database
    this.close = function() {
        client.end();
    }
}
exports.MySqlClient = MySqlClient;