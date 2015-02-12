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

var crypto = require('crypto');

var User = require(__root + 'model/user');

var UserForm = require(__root + 'form/userForm');
var PasswordForm = require(__root + 'form/passwordForm');
var forms = require(__root + 'form/formValidation');
var Utils = require(__root + 'utils/utils');

var CustomError = require(__root + 'utils/errors/errors');
var errorTypes = require(__root + 'utils/errors/errors').types;

var Logger = require(__root + 'utils/logger').Logger;

function UserController() {

	// LOGGER
	var logger = new Logger('UserController');

	/**
	 * GET users listing.
	 */
	this.userForm = function(req, res, next) {

		logger.logDebug('access to UserController form display.');

		User.find({}, function(err, users) {

			if (err) {
				logger.logError('error while finding users ' + err);
				return next(err);
			}

			req.viewProperties = { name : 'user/user-form', title : 'Utilisateurs', users : users };
			return next();
		});
	},

	/**
	 * POST user form
	 */
	this.submitForm = function(req, res, next) {

		logger.logDebug('access to UserController form POST.');

		// TODO factoriser validation formulaire dans un middleware

		// validate form
		var userForm = new UserForm(forms.mapForm(req.body));
		var json = forms.validateForm(userForm);

		if (json) {
			logger.logDebug('User form is invalid.');
			return next(new CustomError(errorTypes.INVALID_FORM, json));
		}

		// hash password
		crypto.randomBytes(16, function(err, bytes) {

			if (err) {
				return next(err);
			}

			var user = { _id : userForm.mail };
			user.salt = bytes.toString('utf8');

			user.hash = Utils.hash(userForm.password, user.salt);

			User.create(user, function(err, newUser) {
				if (err) {
					if (err instanceof mongoose.Error.ValidationError) {
						logger.logDebug('User form is invalid.');
						return next(new CustomError(errorTypes.INVALID_FORM, json));
					}
					logger.logError('error while persist users : ' + errPersist);
					return next(err);
				}
			});

			req.viewProperties = { body : 'OK' };
			return next();
		});
	},

	/**
	 * Send a form in a popup to
	 * 
	 * @param req
	 * @param res
	 */
	this.passwordForm = function(req, res, next) {

		logger.logDebug('access to UserController password form display.');

		req.viewProperties = { name : 'user/password-form', title : 'Password' };
		return next();
	},

	/**
	 * 
	 * @param req
	 * @param res
	 * @returns
	 */
	this.submitPasswordForm = function(req, res, next) {

		logger.logDebug('access to UserController password form POST.');

		// TODO factoriser validation formulaire dans un middleware

		var passwordForm = new PasswordForm(forms.mapForm(req.body));
		var json = forms.validateForm(passwordForm);

		if (json || passwordForm.password != passwordForm.confirm) {
			return errors.throwInvalidForm(req, res, '', json);
		}

		// find Login
		// TODO use mongoose
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
				user.id = req.session.userId;

				// persist user
				dao.persist(user, function(errPersist, id) {

					if (errPersist) {
						logger.logError('error while persist users : ' + errPersist);
						return errors.throwServerError(req, res, errPersist);
					}

					res.send('OK');
				});
			});
		});
	};
}

// MODULE EXPORTS.
module.exports.UserController = UserController;
