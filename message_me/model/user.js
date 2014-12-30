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
 * Utilities functions on authenticated user.
 */
var mongoose = require('mongoose');

/**
 * Mongoose Schema
 */
var schema = mongoose.Schema({
	_id : { type : String, lowercase : true, trim : true },
	name : { type : String },
	firstname : { type : String },
	salt : { type : String, required : true },
	hash : { type : String, required : true } });

/**
 * Find users whose name or first name contains the given 'term
 * 
 * @param term
 *          The term to find
 * @param callback
 * 
 */
schema.statics.findUsersLikeName = function(term, callback) {

	var nameExp = new RegExp('.*' + term + '.*', 'i');
	this.find({ "$or" : [ { name : nameExp }, { firstname : nameExp } ] }).sort('firstname').exec(callback);
};

module.exports = mongoose.model('User', schema);