/**
 * for https, see http://www.hacksparrow.com/node-js-https-ssl-certificate.html
 */

// Global variable which is this dirname.
// This is to be used on require() calls, to avoid multiple '../'
global.__root = __dirname + '/';

/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var https = require("https");
var fs = require("fs");

// routes
var Routes = require(__root + 'routes/base/routes');

// utils
var connection = require(__root + 'model/base/dbConnection');
var middleware = require(__root + 'utils/middleware');

// LOGGER
var Logger = require(__root + 'utils/logger').Logger;
var logger = new Logger('app');

/**
 * Open Mongo connections
 */
connection(function() {

    var app = express();
    middleware(app);

    // Init routes controllers
    var routes = new Routes();
    routes.initControllers(app);

    // certificate creation :
    // https://devcenter.heroku.com/articles/ssl-certificate-self
    var options = {
        key : fs.readFileSync(__root + 'keys/server.key'),
        cert : fs.readFileSync(__root + 'keys/server.crt') };

    https.createServer(options, app).listen(app.get('port'), function() {

        logger.logInfo("Express https server listening on port " + app.get('port'));
    });
});