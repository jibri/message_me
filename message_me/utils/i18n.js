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

var DEFAULT_LOCAL = 'fr';
var LOCAL = DEFAULT_LOCAL;
module.exports.lang = setLang;
module.exports.get = getMessage;

function setLang(lang) {

    LOCAL = lang;
}

function getMessage(msgKey, args, local) {

    var tmpLocal = local || LOCAL;

    var messages = require(__root + 'public/config/message_' + tmpLocal);

    if (!messages) {
        // check the default language file.
        messages = require(__root + 'public/config/message_' + DEFAULT_LOCAL);
        if (!messages) {
            // No file for i18n messages.
            throw new Error('Could not find "public/config/message_' + DEFAULT_LOCAL + '".');
        }
    }

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
        if (tmpLocal != DEFAULT_LOCAL) {
            return getMessage(msgKey, args, DEFAULT_LOCAL);
        }
    }

    return msg;
}