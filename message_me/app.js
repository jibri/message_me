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
var ViewRender = require(__root + 'routes/base/viewRender');

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
	Routes.initControllers(app);

	// View Render
	app.use(ViewRender.render);

	// doc for certificate creation :
	// https://devcenter.heroku.com/articles/ssl-certificate-self

	// https certificate
	var options = { key : fs.readFileSync(__root + 'keys/server.key'), cert : fs.readFileSync(__root + 'keys/server.crt') };

	// https Server
	https.createServer(options, app).listen(app.get('port'), function() {

		logger.logInfo("Express https server listening on port " + app.get('port'));
	});

	// http Server which will redirect all to https
	http.createServer(app).listen(app.get('port') + 1, function() {

		logger.logInfo("Express http server listening on port " + app.get('port') + 1);
	});
});
