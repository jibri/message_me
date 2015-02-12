/**
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE Version 2, December 2004
 * 
 * Copyright (C) 2004 Jeremie Briand <jeremie.briand@outlook.fr>
 * 
 * Everyone is permitted to copy and distribute verbatim or modified copies of
 * this license document, and changing it is allowed as long as the name is
 * changed.
 * 
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE TERMS AND CONDITIONS FOR COPYING,
 * DISTRIBUTION AND MODIFICATION
 * 
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 */

var mongoose = require('mongoose');

var User = require(__root + 'model/user');

var urls = require(__root + 'routes/base/urls').urls;

var forms = require(__root + 'form/formValidation');
var LoginForm = require(__root + 'form/loginForm');

var i18n = require(__root + 'utils/i18n');
var Logger = require(__root + 'utils/logger').Logger;
var Utils = require(__root + 'utils/utils');
var CustomError = require(__root + 'utils/errors/errors');
var errorTypes = require(__root + 'utils/errors/errors').types;

function LoginController() {

	// LOGGER
	var logger = new Logger('LoginController');

	/*
	 * GET login page.
	 */
	this.form = function(req, res, next) {

		logger.logDebug('access to LoginController form display.');

		if (req.session.connected) {
			req.viewProperties = { redirect : urls.INDEX };
			return next();
		}

		req.viewProperties = { name : 'login/login', title : 'Connexion' };
		return next();
	},

	/*
	 * POST login form
	 */
	this.submitForm = function(req, res, next) {

		logger.logDebug('access to LoginController form POST.');

		var loginForm = new LoginForm(forms.mapForm(req.body));
		var json = forms.validateForm(loginForm);

		if (json) {
			return next(new CustomError(errorTypes.INVALID_FORM, json));
		}

		// find Login
		User.findById(loginForm.login, function(err, user) {

			// Unknown error
			if (err) {
				logger.logError('User ' + loginForm.login + ' authentification failure : ' + err);
				return next(err);
			}

			// User with this login doesn't exist
			if (!user || user.length === 0) {
				logger.logDebug('User ' + loginForm.login + ' authentification failure : bad login');
				return next(new CustomError(errorTypes.INVALID_FORM, i18n.get('login_connexion_failed')));
			}

			// Bad password
			if (user.hash != Utils.hash(loginForm.password, user.salt)) {
				logger.logDebug('User ' + user._id + ' authentification failure : bad password.');
				return next(new CustomError(errorTypes.INVALID_FORM, i18n.get('login_connexion_failed')));
			}

			logger.logDebug('User ' + user.name + ' authentified successfully.');

			// Session storage
			req.session.connected = true;
			req.session.userId = user.id;
			req.session.userName = user.name;
			req.session.userFirstname = user.firstname;

			// NEW USER HACK
			// FIXME : maybe not a good practice ?
			// password == 'anecdotme', It must be changed
			if (loginForm.password === 'anecdotme') {
				// redirect to change password form
				req.viewProperties = { redirect : urls.USERS_PASSWORD_POPUP };
			} else {
				req.viewProperties = { body : 'OK' };
			}

			return next();
		});
	},

	/*
	 * Logout controller
	 */
	this.logout = function(req, res, next) {

		logger.logDebug('access to LoginController logout.');

		req.session.destroy(function() {

			req.viewProperties = { redirect : urls.ROOT };
			return next();
		});
	};
}

// MODULE EXPORTS
module.exports.LoginController = LoginController;
