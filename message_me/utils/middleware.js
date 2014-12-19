/**
 * Middleware utilities methods to use with express app.
 * 
 * @author Jeremie BRIAND
 */

var express = require('express');
var moment = require('moment');
var path = require('path');
var appConfig = require(__root + 'public/config/app.config');
var Routes = require(__root + 'routes/base/routes');
var i18n = require(__root + 'utils/i18n');
var forms = require(__root + 'form/formValidation');
var Logger = require(__root + 'utils/logger').Logger;

// htaccess for node js
var auth = require("http-auth");
var basic = auth.basic({ realm : "Private area", file : __root + "htpasswd" });

/**
 * Instanciate all middleware for the app entry point.
 * 
 * @param app
 *            The express app
 */
function middleware(app) {

    // htaccess authentication
    app.use(auth.connect(basic));

    // Logger config
    Logger.config(appConfig.logger.path, appConfig.logger.level);

    // the port of the app
    app.set('port', process.env.PORT || appConfig.port);

    // views dir for express "res.render()"
    app.set('views', path.join(__root, 'views'));
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
    app.locals.url = Routes.urls;

    // Favicon
    app.use(express.favicon('public/images/favicon.png'));

    // i18n for form validation
    forms.setI18N(i18n.get);

    // pour récupérer les éléments d'un formulaire avec req.body.<name>
    app.use(express.bodyParser());

    // The 2 next lines goes together in order to keep object in session as
    // cookies.
    app.use(express.cookieParser('C00ki3s-S3cr3t'));
    app.use(express.session());

    // Indique que "/public" contient des fichiers statics (convention)
    app.use(express.static(path.join(__root, 'public')));
}

// MODULE EXPORTS
module.exports = middleware;