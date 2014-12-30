/**
 *        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2004 Jeremie Briand <jeremie.briand@outlook.fr>
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 */

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
