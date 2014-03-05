/**
 * for https, see http://www.hacksparrow.com/node-js-https-ssl-certificate.html
 */

/**
 * Module dependencies.
 */
var appConfig = require('./public/config/app.config');
var express = require('express');
var routes = require('./routes');
var login = require('./routes/login');
var user = require('./routes/user');
var conversation = require('./routes/conversation');
var http = require('http');
var path = require('path');
var moment = require('moment');
var urlMapping = require('./utils/urlMapping');
var i18n = require('./utils/i18n');

var app = express();

app.configure(function() {

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

  app.use(express.favicon('public/images/favicon.png'));
  // logger
  app.use(express.logger(appConfig.log));
  // pour récupérer les éléments d'un formulaire avec req.body.<name>
  app.use(express.bodyParser());

  // The 2 next lines goes together in order to keep object in session as cookies.
  app.use(express.cookieParser('C00ki3s-S3cr3t'));
  app.use(express.session());

  // Indique que "/public" contient des fichiers statics (convention)
  app.use(express.static(path.join(__dirname, 'public')));

});

app.all(urlMapping.AUTH_ROOT + '*', function(req, res, next) {

  console.log('authenticated access ? : ' + req.session.connected);
  
  if (req.session.connected) {
    next();
  } else {
    res.redirect(urlMapping.ROOT);
  }
});
app.get(urlMapping.ROOT, login.form);
app.post(urlMapping.ROOT, login.submitForm);
app.get(urlMapping.LOGOUT, login.logout);
app.get(urlMapping.INDEX, routes.index);
app.get(urlMapping.USERS, user.form);
app.post(urlMapping.USERS, user.submitForm);
app.get(urlMapping.CONVERSATION, conversation.getConversation);
app.get(urlMapping.CONVERSATION_FORM, conversation.popupConversationForm);
app.post(urlMapping.CONVERSATION, conversation.postConversation);
app.post(urlMapping.GET_MESSAGES, conversation.getMessages);

http.createServer(app).listen(app.get('port'), function() {

  console.log("Express server listening on port " + app.get('port'));
});
