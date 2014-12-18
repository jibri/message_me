var DEFAULT_LOCAL = 'fr';
var LOCAL = DEFAULT_LOCAL;
module.exports.lang = setLang;
module.exports.get = getMessage;

function setLang(lang) {

	LOCAL = lang;
}

function getMessage(msgKey, args, local) {

	if (!local) {
		local = LOCAL;
	}

	var messages = require(__root + 'public/config/message_' + local);
	var msg = messages[msgKey];

	if (msg) {
		if (Array.isArray(args)) {
			if (args && args.length !== 0) {
				for (var i = 0; i < args.length; i++) {
					msg = msg.replace('{' + i + '}', args[i]);
				}
			}
		} else {
			msg = msg.replace('{0}', args);
		}
	} else {
		// check the default language file.
		if (local != DEFAULT_LOCAL) {
			return getMessage(msgKey, args, DEFAULT_LOCAL);
		}
	}

	return msg;
}