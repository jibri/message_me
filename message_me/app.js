/**
 * for https, see http://www.hacksparrow.com/node-js-https-ssl-certificate.html
 */

// Global variable which is this dirname.
// This is to be used on require() calls, to avoid multiple '../'
global.__root = __dirname + '/';

/**
 * Module dependencies.
 */

// node_modules
var express = require('express');
var http = require('http');
var moment = require('moment');
var path = require('path');

// public
var appConfig = require(__root + 'public/config/app.config');

// routes
var index = require(__root + 'routes/indexController');
var login = require(__root + 'routes/loginController');
var user = require(__root + 'routes/userController');
var conversation = require(__root + 'routes/conversationController');

// utils
var urlMapping = require(__root + 'routes/base/urlMapping');
var i18n = require(__root + 'utils/i18n');
var Logger = require(__root + 'utils/logger').Logger;
var forms = require(__root + 'form/formValidation');

var logger = new Logger();
var app = express();

app.configure(function() {

  // the port of the app
  app.set('port', appConfig.port);

  // views dir for express "res.render()"
  app.set('views', path.join(__dirname, 'views'));
  // views dir for jade files (for include & extends statements)
  app.locals.basedir = app.get('views');
  app.set('view engine', appConfig.viewEngine);

  // moment.js
  moment.lang(appConfig.lang);
  app.locals.moment = moment;

  // I18N messages
  i18n.lang(appConfig.lang);
  app.locals.i18n = i18n;

  // Url mapping in locals
  app.locals.url = urlMapping;

  // Favicon
  app.use(express.favicon('public/images/favicon.png'));

  // loggers
  logger.setFilePath(__root + appConfig.logger.path);
  logger.setLogLevel(appConfig.logger.level);

  // i18n for form validation
  forms.setI18N(i18n.get);

  // pour récupérer les éléments d'un formulaire avec req.body.<name>
  app.use(express.bodyParser());

  // The 2 next lines goes together in order to keep object in session as cookies.
  app.use(express.cookieParser('C00ki3s-S3cr3t'));
  app.use(express.session());

  // Indique que "/public" contient des fichiers statics (convention)
  app.use(express.static(path.join(__dirname, 'public')));

});

app.all(urlMapping.AUTH_ROOT + '*', function(req, res, next) {

  logger.logDebug('authenticated access ? : ' + req.session.connected);

  if (req.session.connected) {
    next();
  } else {
    res.redirect(urlMapping.ROOT);
  }
});
app.get(urlMapping.ROOT, login.form);
app.post(urlMapping.ROOT, login.submitForm);
app.get(urlMapping.LOGOUT, login.logout);
app.get(urlMapping.INDEX, index.index);
app.get(urlMapping.USERS, user.form);
app.post(urlMapping.USERS, user.submitForm);
app.get(urlMapping.CONVERSATION, conversation.getConversation);
app.post(urlMapping.CONVERSATION, conversation.postMessage);
app.get(urlMapping.CONVERSATION_FORM, conversation.popupConversationForm);
app.post(urlMapping.CONVERSATION_FORM, conversation.postConversation);
app.get(urlMapping.GET_USERS_AUTOCOMPLETE, conversation.getUsersAutocomplete);
app.post(urlMapping.GET_MESSAGES, conversation.getMessages);

http.createServer(app).listen(app.get('port'), function() {

  // Formane module can't log in console at this point. WHY ?
  logger.logInfo("Express server listening on port " + app.get('port'));
  logger.logError("Express server listening on port " + app.get('port'));
  logger.logDebug("Express server listening on port " + app.get('port'));
  logger.log("Express server listening on port " + app.get('port'), logger.LOG_LEVELS.NONE);
});
