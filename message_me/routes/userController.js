/*
 * req.body.<name> : get the value of a form element req.params : contains request parameters right in the URL before ?
 * req.query : contains request parameters in the GET query after ?
 * 
 */
var hash = require('credential');
var errors = require(__root + 'routes/errorsController');
var urlMapping = require(__root + 'routes/base/urlMapping');
var dao = require(__root + 'model/base/dbConnection');
var viewHandler = require(__root + 'routes/base/viewsHandler');
var User = require(__root + 'model/user').User;
var UserForm = require(__root + 'form/userForm');
var PasswordForm = require(__root + 'form/passwordForm');
var forms = require(__root + 'form/formValidation');
var Logger = require(__root + 'utils/logger').Logger;

// LOGGER
var logger = new Logger();

// ----------------
// MODULE.EXPORTS
// ----------------
module.exports.passowrdForm = passwordForm;
module.exports.submitPassowrdForm = submitPasswordForm;
module.exports.form = userForm;
module.exports.submitForm = submitForm;

// ----------------
// FUNCTIONS
// ----------------

/*
 * GET users listing.
 */
function userForm(req, res) {

  // res.render('', args) render jade, ejs ... template
  // res.send( code_status i.e. 200,404, '') render a string to send.
  // res.send('Hello-world');
  // res.status(404).render('', args) render template with given status

  dao.findAll(new User(), function(err, users) {

    if (err) {
      logger.logError('error while finding users' + err);
      return errors.throwServerError(req, res, err);
    }

    viewHandler.render(req, res, 'user/user-form', 'Utilisateurs', { users : users });
  });
}

/*
 * POST user form
 */
function submitForm(req, res) {

  // validate form
  var userForm = new UserForm(forms.mapForm(req.body));
  var json = forms.validateForm(userForm);

  if (json) {
    return errors.throwInvalidForm(req, res, '', json);
  }

  // hash password
  hash.hash(userForm.password, function(err, JSONHash) {

    if (err) {
      return errors.throwInvalidForm(req, res, err);
    }

    // set hased password
    userForm.password = JSONHash;

    var user = new User(userForm);

    // persist user
    dao.persist(user, function(errPersist, id) {

      if (errPersist) {
        logger.logError('error while persist users : ' + errPersist);
        return errors.throwServerError(req, res, errPersist);
      }

      res.send('OK');
    });
  });
}

/**
 * Send a form in a popup to
 * 
 * @param req
 * @param res
 */
function passwordForm(req, res) {

  viewHandler.render(req, res, 'user/password-form', 'Password');
}

/**
 * 
 * @param req
 * @param res
 * @returns
 */
function submitPasswordForm(req, res) {

  var passwordForm = new PasswordForm(forms.mapForm(req.body));
  var json = forms.validateForm(passwordForm);

  if (json || passwordForm.password != passwordForm.confirm) {
    return errors.throwInvalidForm(req, res, '', json);
  }

  // find Login
  dao.find(new User(), { id : req.session.userId }, function(errFind, userForm) {

    userForm = userForm[0];

    if (errFind || !userForm || userForm.length === 0) {
      logger.logError('User with id #' + req.session.userId + ' was not found : ' + errFind);
      return errors.throwServerError(req, res, errFind);
    }

    // hash password
    hash.hash(passwordForm.password, function(errHash, JSONHash) {

      if (errHash) {
        return errors.throwInvalidForm(req, res, errHash);
      }

      // set hased password
      userForm.password = JSONHash;
      console.log(userForm);
      var user = new User(userForm);

      // persist user
      // FIXME update entity
      dao.persist(user, function(errPersist, id) {

        if (errPersist) {
          logger.logError('error while persist users : ' + errPersist);
          return errors.throwServerError(req, res, errPersist);
        }

        res.send('OK');
      });
    });
  });
}
