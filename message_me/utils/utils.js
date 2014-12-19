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
 *            The object to test
 * @returns If it's an object
 */
function isObject(obj) {

    return typeof obj == 'object' && obj && Object.keys(obj).length > 0 && !utils.isArray(obj);
}

/**
 * return the s parameter as a string
 * 
 * @param s
 *            any object
 * @returns s if it a string, '' else.
 */
function validString(s) {
    var valid;
    if ('string' != typeof s) {
        valid = '';
    } else {
        valid = s;
    }
    return valid.trim();
}

/**
 * Create a hash with the given pass and salt
 * 
 * @param pass
 *            the password to hash
 * @param salt
 *            the required salt for hashing
 * @returns the created hash
 */
function hash(pass, salt) {
    var hash = crypto.createHash('sha512');
    hash.update(pass, 'utf8');
    hash.update(salt, 'utf8');
    return hash.digest('base64');
}

// MODULE EXPORTS
module.exports.isObject = isObject;
module.exports.validString = validString;
module.exports.hash = hash;