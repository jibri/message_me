/*
 * req.body.<name> : get the value of a form element
 * req.params : contains request parameters right in the URL before ?
 * req.query : contains request parameters in the GET query after ?
 * 
 */
var urlMapping = require('../utils/urlMapping');
var hash = require('credential');
var errors = require('../routes/errors');
var viewHandler = require('../utils/viewsHandler');
var userModel = require('../model/user');
var i18n = require('../utils/i18n');

/*
 * GET users listing.
 */
exports.form = function(req, res) {

  // password = 'a'
  // hash =
  // {"hash":"2RoVYt+ua+lPnk6xuFvv7ys9T5v7uGSa+uPFcSHlahaBO1uf0tSVSEw6OYoEl3OsYgI/rOlLcZGib+oS8y6cKsH6","salt":"tiwn/mRMrWezVNyM7/ASGsBmNUeOTHRj1Pc66uqUSciSlTR+5rc1E/p+h2bBdRs015I9KicyzaAPFWHB6CNIaxbY","keyLength":66,"hashMethod":"pbkdf2","workUnits":60}

  if (req.session.connected) {
    res.redirect(urlMapping.INDEX);
  }
  viewHandler.render(req, res, 'login/login', 'Connexion');
};

/*
 * POST user form
 */
exports.submitForm = function(req, res) {

  var loginForm = req.body;

  if (!validateLoginForm(loginForm)) {
    var json = loginFormToJSON(loginForm);
    return errors.throwInvalidForm(req, res, '', json);
  }

  // find Login
  userModel.find({ name : loginForm.name }, function(err, result) {

    if (err) {
      console.log('User ' + loginForm.name + ' authentification failure : ' + err);
      return errors.throwServerError(req, res, err);
    }

    if (!result || result.length === 0) {
      console.log('User ' + loginForm.name + ' authentification failure : bad login');
      return errors.throwInvalidForm(req, res, err, i18n.get('login_connexion_failed'));
    }

    var authUser = result[0];

    // Check Login and password
    hash.verify(authUser.password, loginForm.password, function(err, isValid) {

      if (err) {
        return errors.throwServerError(req, res, err);
      }

      if (isValid) {
        console.log('User ' + authUser.name + ' authentified successfully.');
        // Session storage
        req.session.connected = true;
        req.session.login = authUser.name;
        req.session.userName = authUser.firstname;
        res.send('OK');
      } else {
        console.log('User ' + authUser.name + ' authentification failure : bad password.');
        return errors.throwInvalidForm(req, res, err, i18n.get('login_connexion_failed'));
      }
    });
  });
};

/*
 * Logout controller
 */
exports.logout = function(req, res) {

  req.session.destroy(function() {

    res.redirect(urlMapping.ROOT);
  });
};

function validateLoginForm(form) {

  var hasName = form.name && form.name.length > 0;
  var hasPass = form.password && form.password.length > 0;
  return hasName && hasPass;
}

function loginFormToJSON(form) {

  var json = '{';
  if (!(form.name && form.name.length > 0)) {
    json += '"name":"' + i18n.get('validation_required') + '",';
  }
  if (!(form.password && form.password.length > 0)) {
    json += '"password":"' + i18n.get('validation_required') + '",';
  }

  return json;
}
