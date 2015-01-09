/**
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE Version 2, December 2004
 * 
 * Copyright (C) 2004 Jeremie Briand <jeremie.briand@outlook.fr>
 * 
 * Everyone is permitted to copy and distribute verbatim or modified copies of
 * this license document, and changing it is allowed as long as the name is
 * changed.
 * 
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE TERMS AND CONDITIONS FOR COPYING,
 * DISTRIBUTION AND MODIFICATION
 * 
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 */

var utils = require('util');
var crypto = require('crypto');

/**
 * @Constructor of utils
 */
function Utils() {
    // For static use only
}

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

// STATIC METHODS
Utils.isObject = isObject;
Utils.printObject = printObject;
Utils.validString = validString;
Utils.hash = hash;

// MODULE EXPORTS
module.exports = Utils;