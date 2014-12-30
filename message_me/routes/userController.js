/**
 *        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2004 Jeremie Briand <jeremie.briand@outlook.fr>
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 */

var User = require(__root + 'model/user');
var UserForm = require(__root + 'form/userForm');
var PasswordForm = require(__root + 'form/passwordForm');
var forms = require(__root + 'form/formValidation');
var Logger = require(__root + 'utils/logger').Logger;

function UserController() {

	// LOGGER
	var logger = new Logger();

	/**
	 * GET users listing.
	 */
	this.userForm = function(req, res) {

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
	},

	/**
	 * POST user form
	 */
	this.submitForm = function(req, res) {

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
	},

	/**
	 * Send a form in a popup to
	 * 
	 * @param req
	 * @param res
	 */
	this.passwordForm = function(req, res) {

		viewHandler.render(req, res, 'user/password-form', 'Password');
	},

	/**
	 * 
	 * @param req
	 * @param res
	 * @returns
	 */
	this.submitPasswordForm = function(req, res) {

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
