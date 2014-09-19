/*
 * Mapping of all application URLs
 */

var url = require('url');

// ROOT mapping (free access)
module.exports.ROOT = '/';
module.exports.LOGIN = '/login.html';
module.exports.LOGOUT = '/logout.html';

// ERRORS mapping (free access)
module.exports.ERROR_FORM = '/error-form.html';
module.exports.SERVER_ERROR = '/error-server.html';

// App mapping (authentified access)
var AUTH_ROOT = '/anec-dot-me/';
module.exports.AUTH_ROOT = AUTH_ROOT;
module.exports.INDEX = AUTH_ROOT + 'index.html';
module.exports.USERS = AUTH_ROOT + 'users.html';
module.exports.USERS_PASSWORD_POPUP = AUTH_ROOT + 'users-password.html';
module.exports.IMAGES = AUTH_ROOT + 'image.html';
module.exports.CONVERSATION = AUTH_ROOT + 'messages.html';
module.exports.CONVERSATION_FORM = AUTH_ROOT + 'conversation-form.html';
module.exports.GET_MESSAGES = AUTH_ROOT + 'get-messages.html';
module.exports.GET_USERS_AUTOCOMPLETE = AUTH_ROOT + 'get-users-autocomplete.html';

// url utils
module.exports.resolveUrl = resolveUrl;

function resolveUrl(request, path, query) {

  var urlObj = { protocole : 'http',
                host : request.headers.host,
                pathname : path,
                query : query };
  return url.format(urlObj);
}
