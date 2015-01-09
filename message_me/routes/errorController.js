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

var i18n = require(__root + 'utils/i18n');
var Logger = require(__root + 'utils/logger').Logger;
var CustomError = require(__root + 'utils/errors/errors');
var errorTypes = require(__root + 'utils/errors/errors').types;

/**
 * Error Handler object.
 * 
 * @constructor
 * 
 * @author Jeremie BRIAND
 */
function ErrorController() {

    // Logger
    var logger = new Logger('ErrorController');

    /**
     * Middleware of error handling for express js.
     */
    this.errorHandler = function(err, req, res, next) {

        // True Error (Unhandled)
        if (err instanceof Error) {
            throwServerError(err, req, res, next);
        }

        // Custom Error
        switch (err.name) {
            case errorTypes.INVALID_FORM:
                throwInvalidForm(err, req, res, next);
                break;
            case errorTypes.NOT_ALLOWED:
                throwNotAllowedError(err, req, res, next);
                break;
            default:
                // Unknown
                throwServerError(err, req, res, next);
        }
    };

    /**
     * Return an invalid form json to the client. Code 406.
     */
    function throwInvalidForm(err, req, res, next) {

        var FORM_MESSAGE = i18n.get('validation_generic');
        res.status(406);

        var json = err.message;
        if (json instanceof Object) {
            if (!json.message) {
                json.message = FORM_MESSAGE;
            }
        } else {
            json = json || FORM_MESSAGE;
        }

        logger.logDebug(json.message || json);

        err.message = JSON.stringify(json);
        redirectError(err, req, res, next);
    }

    /**
     * Return Server error to the client. Code 500.
     */
    function throwServerError(err, req, res, next) {

        logger.logError(err.message + '\n' + err.stack);

        var DEFAULT_MESSAGE = i18n.get('server_generic_error');

        res.status(500);
        err.message = err.message || DEFAULT_MESSAGE;
        redirectError(err, req, res, next);
    }

    /**
     * Return Not allowed error to the client. Code 405.
     */
    function throwNotAllowedError(err, req, res, next) {

        var NOT_ALLOWED_MESSAGE = i18n.get('server_not_allowed');

        res.status(405);
        err.message |= NOT_ALLOWED_MESSAGE;
        redirectError(err, req, res, next);
    }

    /**
     * Utils function to render error in the view.
     */
    function redirectError(err, req, res, next) {

        // Ajax call running
        if (req.xhr) {
            req.viewProperties = { body : err.message };
            return next();
        }

        req.viewProperties = { name : 'layout/error', title : 'Erreur', message : err.message, err : err };
        return next();
    }
}

// MODULE EXPORTS
module.exports.ErrorController = ErrorController;