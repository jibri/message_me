/*
 * Mapping of all application URLs
 */

// ROOT mapping (free access)
exports.ROOT = '/';
exports.LOGIN = '/login.html';
exports.LOGOUT = '/logout.html';

// ERRORS mapping (free access)
exports.ERROR_FORM = '/error-form.html';
exports.SERVER_ERROR = '/error-server.html';

// App mapping (authentified access)
var AUTH_ROOT = '/msg_me/';
exports.AUTH_ROOT = AUTH_ROOT;
exports.INDEX = AUTH_ROOT + 'index.html';
exports.USERS = AUTH_ROOT + 'users.html';
exports.IMAGES = AUTH_ROOT + 'image.html';
exports.CONVERSATION = AUTH_ROOT + 'messages.html';
exports.CONVERSATION_FORM = AUTH_ROOT + 'conversation-form.html';
exports.GET_MESSAGES = AUTH_ROOT + 'get-messages.html';
exports.GET_USERS_AUTOCOMPLETE = AUTH_ROOT + 'get-users-autocomplete.html';
