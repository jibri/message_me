var utils = require('util');

module.exports.isObject = isObject;

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