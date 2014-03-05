/**
 * Utilities functions on authenticated user.
 */

var mysql = require('../utils/dbConnection');
var errors = require('../routes/errors');
var TABLE_NAME = 'tb_user';

exports.find = find;
exports.validate = validate;
exports.getUserId = getUserId;
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