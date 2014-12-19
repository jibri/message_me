/*
 * Mapping of all application URLs
 */
var IndexController = require(__root + 'routes/indexController').IndexController;
var LoginController = require(__root + 'routes/loginController').LoginController;
var UserController = require(__root + 'routes/userController').UserController;
var ConversationController = require(__root + 'routes/conversationController').ConversationController;
var ErrorController = require(__root + 'routes/errorController').ErrorController;
var Logger = require(__root + 'utils/logger').Logger;
var logger = new Logger();

var AUTH_ROOT = '/anec-dot-me/';
var urls = {

	// ROOT mapping (free access)
	ROOT : '/',
	LOGIN : '/login.html',
	LOGOUT : '/logout.html',

	// ERRORS mapping (free access)
	ERROR_FORM : '/error-form.html',
	SERVER_ERROR : '/error-server.html',

	// App mapping (authentified access)
	AUTH_ROOT : AUTH_ROOT,
	INDEX : AUTH_ROOT + 'index.html',
	USERS : AUTH_ROOT + 'users.html',
	USERS_PASSWORD_POPUP : AUTH_ROOT + 'users-password.html',
	IMAGES : AUTH_ROOT + 'image.html',
	CONVERSATION : AUTH_ROOT + 'messages.html',
	CONVERSATION_FORM : AUTH_ROOT + 'conversation-form.html',
	GET_MESSAGES : AUTH_ROOT + 'get-messages.html',
	GET_USERS_AUTOCOMPLETE : AUTH_ROOT + 'get-users-autocomplete.html', };

/**
 * @constructor of Routes
 */
function Routes() {

	this.initControllers = function(app) {

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
				next();
			} else {
				res.redirect(urls.ROOT);
			}
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

		// Page does not exists
		// app.all('*', function(req, res, next) {
		//
		// res.redirect(urls.ROOT);
		// });

		// TODO ErrorHandler.
		app.use(error.errorHandler);
	};
}

/**
 * Used to resolve web urls of public object like images.
 * 
 * @param request
 *          The http request
 * @param path
 *          The path of the object
 * @param query
 *          The query
 * @returns the url to the object.
 */
function resolveUrl(request, path, query) {

	var urlObj = { protocole : 'http', host : request.headers.host, pathname : path, query : query };
	return url.format(urlObj);
}

// STATIC METHODS
Routes.urls = urls;
Routes.resolveUrl = resolveUrl;

// MODULE EXPORTS
module.exports = Routes;