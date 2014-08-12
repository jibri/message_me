/**
 * Utilities functions on authenticated user.
 */
var errors = require(__root + 'routes/errorsController');
var mysql = require(__root + 'utils/dbConnection');
var TABLE_NAME = 'tb_user';

exports.find = find;
exports.validate = validate;
exports.getUserId = getUserId;
exports.findUsersLikeName = findUsersLikeName;
exports.TABLE_NAME = TABLE_NAME;

/**
 * Validate the user for the DB Model
 */
function validate() {

  // TODO implement validation
  var notNull = false;
  return notNull;
}

/**
 * find the user id with the given params.
 */
function find(params, callback) {

  mysql.find(TABLE_NAME, params, callback);
}

/**
 * find the authenticated user id.
 */
function getUserId(req, res, callback) {

  find({ name : req.session.login }, function(err, user) {

    if (err) {
      return errors.throwServerError(req, res, err);
    }

    if (user.length === 0) {
      return errors.throwNotAllowedError(req, res, err);
    }

    callback(user[0].id);
  });
}

/**
 * Find users whose name or first name contains the given 'term
 * 
 * @param term
 *          The term to find
 * @param callback
 * 
 */
function findUsersLikeName(term, callback) {

  var query = 'SELECT "user".id, "user".name, "user".firstname FROM ' + TABLE_NAME + ' "user" ';
  query += 'WHERE IULIKE("user".name, \'%' + term + '%\') ';
  query += 'OR IULIKE("user".firstname, \'%' + term + '%\') ';
  query += ' ORDER BY "user".firstname ASC';

  mysql.findQuery(query, callback);
}