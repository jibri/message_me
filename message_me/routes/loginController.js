/*
 * req.body.<name> : get the value of a form element
 * req.params : contains request parameters right in the URL before ?
 * req.query : contains request parameters in the GET query after ?
 * 
 */
var hash = require('credential');
var errors = require(__root + 'routes/errorsController');
var userModel = require(__root + 'model/user');
var urlMapping = require(__root + 'routes/base/urlMapping');
var viewHandler = require(__root + 'routes/base/viewsHandler');
var i18n = require(__root + 'utils/i18n');
var logger = require(__root + 'utils/logger');
var forms = require(__root + 'form/formValidation');
var LoginForm = require(__root + 'form/loginForm');

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

  var loginForm = new LoginForm(forms.mapForm(req.body));
  var json = forms.validateForm(loginForm);

  if (json) {
    return errors.throwInvalidForm(req, res, '', json);
  }

  // find Login
  userModel.find({ name : loginForm.name }, function(err, result) {

    if (err) {
      logger.logError('User ' + loginForm.name + ' authentification failure : ' + err);
      return errors.throwServerError(req, res, err);
    }

    if (!result || result.length === 0) {
      logger.logDebug('User ' + loginForm.name + ' authentification failure : bad login');
      return errors.throwInvalidForm(req, res, err, i18n.get('login_connexion_failed'));
    }

    var authUser = result[0];

    // Check Login and password
    hash.verify(authUser.password, loginForm.password, function(errVerify, isValid) {

      if (errVerify) {
        return errors.throwServerError(req, res, errVerify);
      }

      if (isValid) {
        logger.logDebug('User ' + authUser.name + ' authentified successfully.');
        // Session storage
        req.session.connected = true;
        req.session.userId = authUser.id;
        req.session.login = authUser.name;
        req.session.userName = authUser.firstname;
        res.send('OK');
      } else {
        logger.logDebug('User ' + authUser.name + ' authentification failure : bad password.');
        return errors.throwInvalidForm(req, res, errVerify, i18n.get('login_connexion_failed'));
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
