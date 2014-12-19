/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 jibri
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var view = require(__root + 'routes/base/viewsHandler');
var i18n = require(__root + 'utils/i18n');
var Logger = require(__root + 'utils/logger').Logger;
var CustomError = require(__root + 'utils/errors/errors');
var errorTypes = require(__root + 'utils/errors/errors').types;

/**
 * Error Handler object.
 * @author Jeremie BRIAND
 */
function ErrorController() {

    // Logger
    var logger = new Logger('ErrorController');

    /**
     * Middleware of error handling for express js.
     */
    this.errorHandler = function(err, req, res, next) {

        console.log(err);

        // True Error (Unhandled)
        if (err instanceof Error) {
            throwServerError(req, res, err);
        }

        // Custom Error
        switch (err.name) {
            case errorTypes.INVALID_FORM:
                throwInvalidForm(req, res, err);
                break;
            case errorTypes.NOT_ALLOWED:
                throwNotAllowedError(req, res, err);
                break;
            default:
                // Unknown
                throwServerError(req, res, err);
        }
    };

    /**
     * Return an invalid form json to the client. Code 406.
     */
    function throwInvalidForm(req, res, err) {

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
        logger.logDebug(json.message);

        err.message = JSON.stringify(json);
        redirectError(req, res, err);
    }

    /**
     * Return Server error to the client. Code 500.
     */
    function throwServerError(req, res, err) {

        logger.logError(err.message + '\n' + err.stack);

        var DEFAULT_MESSAGE = i18n.get('server_generic_error');

        res.status(500);
        err.message |= DEFAULT_MESSAGE;
        redirectError(req, res, err);
    }

    /**
     * Return Not allowed error to the client. Code 405.
     */
    function throwNotAllowedError(req, res, err) {

        var NOT_ALLOWED_MESSAGE = i18n.get('server_not_allowed');

        res.status(405);
        err.message |= NOT_ALLOWED_MESSAGE;
        redirectError(req, res, err);
    }

    /**
     * Utils function to render error in the view.
     */
    function redirectError(req, res, err) {

        if (req.xhr) {
            // TODO views handler
            res.send(err.message);
        } else {
            var args = { message : err.message, err : err };
            view.render(req, res, 'layout/error', 'Erreur', args);
        }
    }
}

// MODULE EXPORTS
module.exports.ErrorController = ErrorController;