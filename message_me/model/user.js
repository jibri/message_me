/**
 * Utilities functions on authenticated user.
 */
var errors = require(__root + 'routes/errorsController');
var UserForm = require(__root + 'form/userForm');
var dao = require(__root + 'model/base/dbConnection');
var TABLE_NAME = 'tb_user';

module.exports.User = User;

module.exports.find = find;
module.exports.getUserId = getUserId;
module.exports.findUsersLikeName = findUsersLikeName;
module.exports.TABLE_NAME = TABLE_NAME;

function User(form) {

  if (!form) {
    form = new UserForm();
  }

  this.tableName = TABLE_NAME;

  this.fields = { name : form.name,
                 firstname : form.firstname,
                 password : form.password,
                 mail : form.mail };

  this.validate = [ { field : 'name',
                     type : 'string',
                     max : 30,
                     notNull : true },

                   { field : 'firstname',
                    type : 'string',
                    max : 30,
                    notNull : true },

                   { field : 'password',
                    type : 'string',
                    notNull : true },

                   { field : 'password',
                    type : 'string',
                    max : 250,
                    notNull : true } ];
}

/**
 * find the user id with the given params.
 */
// TODO find as a properties of the object "abstract entity"
function find(params, callback) {

  dao.find(TABLE_NAME, params, callback);
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

  dao.findQuery(query, callback);
}