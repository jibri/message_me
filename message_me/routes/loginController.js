/*
 * req.body.<name> : get the value of a form element req.params : contains request parameters right in the URL before ?
 * req.query : contains request parameters in the GET query after ?
 * 
 */
var mongoose = require('mongoose');
var User = require(__root + 'model/user');
var Routes = require(__root + 'routes/base/routes');
var viewHandler = require(__root + 'routes/base/viewsHandler');
var i18n = require(__root + 'utils/i18n');
var Logger = require(__root + 'utils/logger').Logger;
var hash = require(__root + 'utils/utils').hash;
var crypto = require('crypto');
var forms = require(__root + 'form/formValidation');
var LoginForm = require(__root + 'form/loginForm');
var CustomError = require(__root + 'utils/errors/errors');
var errorTypes = require(__root + 'utils/errors/errors').types;

function LoginController() {

	// LOGGER
	var logger = new Logger('LoginController');

	/*
	 * GET login page.
	 */
	this.form = function(req, res, next) {

		if (req.session.connected) {
			res.redirect(Routes.urls.INDEX);
		}
		viewHandler.render(req, res, 'login/login', 'Connexion');
	},

	/*
	 * POST login form
	 */
	this.submitForm = function(req, res, next) {

		var loginForm = new LoginForm(forms.mapForm(req.body));
		var json = forms.validateForm(loginForm);

		if (json) {
			return next(new CustomError(errorTypes.INVALID_FORM, json));
		}

		// find Login
		User.findById(loginForm.login, function(err, user) {

			if (err) {
				logger.logError('User ' + loginForm.login + ' authentification failure : ' + err);
				return next(err);
			}

			if (!user || user.length === 0) {
				logger.logDebug('User ' + loginForm.login + ' authentification failure : bad login');
				return next(new Error(i18n.get('login_connexion_failed')));
			}

			// Check Login and password
			if (user.hash == hash(loginForm.password, user.salt)) {

				logger.logDebug('User ' + user.name + ' authentified successfully.');
				// Session storage
				req.session.connected = true;
				req.session.userId = user.id;
				req.session.userName = user.name;
				req.session.userFirstname = user.firstname;

				// password == 'anecdotme', It must be changed
				if (loginForm.password === 'anecdotme') {
					res.redirect(Routes.urls.USERS_PASSWORD_POPUP);
				} else {
					res.send('OK');
				}

			} else {
				logger.logDebug('User ' + user._id + ' authentification failure : bad password.');
				return next(new Error(i18n.get('login_connexion_failed')));
			}
		});
	},

	/*
	 * Logout controller
	 */
	this.logout = function(req, res, next) {

		req.session.destroy(function() {

			res.redirect(Routes.urls.ROOT);
		});
	};
}

// MODULE EXPORTS
module.exports.LoginController = LoginController;
