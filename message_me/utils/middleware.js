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

// One Year representation in millisecond
var ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;


/**
 * Middleware utilities methods to use with express app.<br>
 * Instanciate all middleware for the app entry point.
 * 
 * @author Jeremie BRIAND
 * @param app
 *            The express app
 */
function middleware(app) {

    // Enable 'trust proxy' for http redirection to https
    app.enable('trust proxy');
    app.use(function(req, res, next) {
        
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            // request was via http, so redirect to https
            console.log('request is unsecured http -> redirect to https.');
            res.redirect('https://' + req.headers.host.split(':')[0] + ':' + app.get('port') + req.url);
        }
    });

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

    // Middleware to determine Locale
    app.use(function(req, res, next) {

        // Language is taken eather in the 'lang' cookie or from the config file
        var lang = req.cookies.lang || appConfig.lang;
        
        app.set('lang', lang);
        res.cookie('lang', lang, { maxAge: ONE_YEAR_MS });

        // moment.js
        moment.lang(lang);
        app.locals.moment = moment;

        // I18N messages
        i18n.lang(lang);
        app.locals.i18n = i18n;

        // Url mapping in locals
        app.locals.url = Routes.urls;

        next();
    });
}

// MODULE EXPORTS
module.exports = middleware;