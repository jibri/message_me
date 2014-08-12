/*
 * req.body.<name> : get the value of a form element
 * req.params : contains request parameters right in the URL before ?
 * req.query : contains request parameters in the GET query after ?
 * 
 */
var hash = require('credential');
var errors = require(__root + 'routes/errorsController');
var urlMapping = require(__root + 'utils/urlMapping');
var mysql = require(__root + 'utils/dbConnection');
var viewHandler = require(__root + 'utils/viewsHandler');
var logger = require(__root + 'utils/logger');

/*
 * GET users listing.
 */
exports.form = function(req, res) {

  // res.render('', args) render jade, ejs ... template
  // res.send( code_status i.e. 200,404, '') render a string to send.
  // res.send('Hello-world');
  // res.status(404).render('', args) render template with given status

  mysql.findAll('tb_user', function(err, users) {

    if (err) {
      logger.logError('error while finding users' + err);
      return errors.throwServerError(req, res, err);
    }

    viewHandler.render(req, res, 'user/user-form', 'Utilisateurs', { users : users });
  });
};

/*
 * POST user form
 */
exports.submitForm = function(req, res) {

  var user = req.body;

  // validate form
  if (!validateUser(user)) {
    return errors.throwInvalidForm(req, res);
  }

  // hash password
  hash.hash(user.password, function(err, JSONHash) {

    if (err) {
      return errors.throwInvalidForm(req, res, err);
    }

    // set hased password
    user.password = JSONHash;

    // persist user
    mysql.persist('tb_user', user, function(err, id) {

      if (err) {
        logger.logError('error while persist users : ' + err);
        return errors.throwServerError(req, res, err);
      }

      res.redirect(urlMapping.INDEX);
    });
  });
};

function validateUser(user) {

  var hasName = user.name && user.name.length > 0;
  var hasFirstname = user.firstName && user.firstName.length > 0;
  var hasPass = user.password && user.password.length > 0;
  return hasName && hasFirstname && hasPass;
}
