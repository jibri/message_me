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