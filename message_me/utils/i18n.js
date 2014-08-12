var LOCAL = 'en';
module.exports.lang = setLang;
module.exports.get = getMessage;

function setLang(lang) {

  LOCAL = lang;
}

function getMessage(msgKey, args) {

  var messages = require(__root + 'public/config/message_' + LOCAL);
  var msg = messages[msgKey];

  if (msg) {
    if (Array.isArray(args)) {
      if (args && args.length !== 0) {
        for ( var i = 0; i < args.length; i++) {
          msg = msg.replace('{' + i + '}', args[i]);
        }
      }
    } else {
      msg = msg.replace('{0}', args);
    }
  }

  return msg;
}