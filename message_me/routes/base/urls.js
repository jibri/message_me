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

var AUTH_ROOT = '/anec-dot-me/';

/**
 * Urls of the app
 */
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
	GET_USERS_AUTOCOMPLETE : AUTH_ROOT + 'get-users-autocomplete.html' };

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
Urls = { urls : urls, resolveUrl : resolveUrl };

// MODULE EXPORTS
module.exports = Urls;