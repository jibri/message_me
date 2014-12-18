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
var Routes = require(__root + 'routes/base/routes').Routes;

// utils
var connection = require(__root + 'model/base/dbConnection');
var urls = require(__root + 'routes/base/routes');
var i18n = require(__root + 'utils/i18n');
var Logger = require(__root + 'utils/logger').Logger;
var forms = require(__root + 'form/formValidation');

// LOGGER
var logger = new Logger();

/**
 * Open Mongo connections
 */
connection(function() {

	var app = express();

	app.configure(function() {

		// the port of the app
		app.set('port', process.env.PORT || appConfig.port);

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
		app.locals.url = urls.urls;

		// Favicon
		app.use(express.favicon('public/images/favicon.png'));

		// loggers
		logger.setFilePath(__root + appConfig.logger.path);
		logger.setLogLevel(appConfig.logger.level);

		// i18n for form validation
		forms.setI18N(i18n.get);

		// pour récupérer les éléments d'un formulaire avec req.body.<name>
		app.use(express.bodyParser());

		// The 2 next lines goes together in order to keep object in session as
		// cookies.
		app.use(express.cookieParser('C00ki3s-S3cr3t'));
		app.use(express.session());

		// Indique que "/public" contient des fichiers statics (convention)
		app.use(express.static(path.join(__dirname, 'public')));

	});

	// Init routes controllers
	var routes = new Routes();
	routes.initControllers(app);

	http.createServer(app).listen(app.get('port'), function() {

		// Formane module can't log in console at this point. WHY ?
		logger.logInfo("Express server listening on port " + app.get('port'));
	});
});