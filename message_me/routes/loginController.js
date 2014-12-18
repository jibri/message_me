/*
 * req.body.<name> : get the value of a form element req.params : contains request parameters right in the URL before ?
 * req.query : contains request parameters in the GET query after ?
 * 
 */
var mongoose = require('mongoose');
var User = require(__root + 'model/user');
var routes = require(__root + 'routes/base/routes');
var viewHandler = require(__root + 'routes/base/viewsHandler');
var i18n = require(__root + 'utils/i18n');
var Logger = require(__root + 'utils/logger').Logger;
var hash = require(__root + 'utils/utils').hash;
var crypto = require('crypto');
var forms = require(__root + 'form/formValidation');
var LoginForm = require(__root + 'form/loginForm');

function LoginController() {

	// LOGGER
	var logger = new Logger();

	/*
	 * GET login page.
	 */
	this.form = function(req, res, next) {

		if (req.session.connected) {
			res.redirect(routes.urls.INDEX);
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
			var err = new Error(json.message);
			err.name = 'UNACCEPTABLE';
			err.json = json;
			return next(err);
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
					res.redirect(routes.urls.USERS_PASSWORD_POPUP);
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

			res.redirect(routes.urls.ROOT);
		});
	};
}

// MODULE EXPORTS
module.exports.LoginController = LoginController;
