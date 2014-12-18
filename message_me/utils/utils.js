var utils = require('util');
var crypto = require('crypto');

/**
 * Test if the given ojbect is an objet with properties 'key:value'.
 * 
 * It gives the following results :
 * <li> undefined => false
 * <li> null => null
 * <li> "" => false
 * <li> "salut" => false
 * <li> 0 => false
 * <li> 1 => false
 * <li> [] => false
 * <li> ['aze', 'rty'] => false
 * <li> {} => false
 * <li> { aze : 'rty' } => true
 * 
 * @param obj
 *          The object to test
 * @returns If it's an object
 */
function isObject(obj) {

	return typeof obj == 'object' && obj && Object.keys(obj).length > 0 && !utils.isArray(obj);
}

function validString(s) {
	if ('string' != typeof s) {
		s = '';
	}
	return s.trim();
}

function hash(pass, salt) {
	var hash = crypto.createHash('sha512');
	hash.update(pass, 'utf8');
	hash.update(salt, 'utf8');
	return hash.digest('base64');
}

module.exports.isObject = isObject;
module.exports.validString = validString;
module.exports.hash = hash;