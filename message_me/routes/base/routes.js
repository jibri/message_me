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

var IndexController = require(__root + 'routes/indexController').IndexController;
var LoginController = require(__root + 'routes/loginController').LoginController;
var UserController = require(__root + 'routes/userController').UserController;
var ConversationController = require(__root + 'routes/conversationController').ConversationController;
var ErrorController = require(__root + 'routes/errorController').ErrorController;

var CustomError = require(__root + 'utils/errors/errors');
var errorTypes = require(__root + 'utils/errors/errors').types;

var urls = require(__root + 'routes/base/urls').urls;

var Logger = require(__root + 'utils/logger').Logger;
var logger = new Logger();

/**
 * Mapping of all application URLs
 */
function initControllers(app) {

	// Inject the controllers
	var login = new LoginController();
	var index = new IndexController();
	var user = new UserController();
	var conversation = new ConversationController();
	var error = new ErrorController();

	// Check authentication
	app.all(urls.AUTH_ROOT + '*', function(req, res, next) {

		logger.logDebug('authenticated access ? : ' + req.session.connected);

		// TODO Check id in DB
		if (req.session.connected) {
			return next();
		}

		res.redirect(urls.ROOT);
	});

	// Login
	app.get(urls.ROOT, login.form);
	app.post(urls.ROOT, login.submitForm);
	app.get(urls.LOGOUT, login.logout);

	// Index
	app.get(urls.INDEX, index.index);

	// User
	app.get(urls.USERS, user.userForm);
	app.post(urls.USERS, user.submitForm);
	app.get(urls.USERS_PASSWORD_POPUP, user.passwordForm);
	app.post(urls.USERS_PASSWORD_POPUP, user.submitPasswordForm);

	// Conversation
	app.get(urls.CONVERSATION, conversation.getConversation);
	app.post(urls.CONVERSATION, conversation.postMessage);
	app.get(urls.CONVERSATION_FORM, conversation.popupConversationForm);
	app.post(urls.CONVERSATION_FORM, conversation.postConversation);
	app.post(urls.GET_MESSAGES, conversation.getMessages);
	app.get(urls.GET_USERS_AUTOCOMPLETE, conversation.getUsersAutocomplete);

	// Page does not exists : 404
	app.use(function(req, res, next) {
		if (!req.viewProperties) {
			return next(new CustomError(errorTypes.NOT_FOUND_404));
		}
		return next();
	});

	app.use(error.errorHandler);
}

// STATIC METHODS
Routes = { initControllers : initControllers };

// MODULE EXPORTS
module.exports = Routes;