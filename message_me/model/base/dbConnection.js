/**
 * DB postgres Connections
 */

/**
 * Database config
 */
var db_full_config = require(__root + 'public/config/database.config');
var db_config = db_full_config[db_full_config.env];
var db_conString = 'mongodb://' + db_config.host + ':' + db_config.port + '/' + db_config.database;

var mongoose = require('mongoose');
var Logger = require(__root + 'utils/logger').Logger;

/**
 * 
 * @param callback
 */
function connectMongoose(callback) {
	mongoose.connect(db_conString, callback);
}

/**
 * exports attributes
 */
module.exports = exports = connectMongoose;
