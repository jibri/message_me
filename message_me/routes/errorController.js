/*
 * Error handler
 */
var view = require(__root + 'routes/base/viewsHandler');
var i18n = require(__root + 'utils/i18n');
var Logger = require(__root + 'utils/logger').Logger;

function ErrorController() {

	var logger = new Logger();

	this.errorHandler = function(err, req, res, next) {

		switch (err.name) {
			case 'UNACCEPTABLE':
				throwInvalidForm(req, res, err, err.json);
				break;
			default:
				logger.logError(typeof err);
				throwServerError(req, res, err, err.message);
		}

		logger.logError(err.message);
		logger.logError(err.stack);
	};

	function throwInvalidForm(req, res, err, json) {

		var FORM_MESSAGE = i18n.get('validation_generic');
		res.status(406);

		if (json instanceof Object) {
			if (!json.message) {
				json.message = FORM_MESSAGE;
			}
		} else {
			json = json || FORM_MESSAGE;
		}
		redirectError(req, res, err, JSON.stringify(json));
	}
	;

	function throwServerError(req, res, err, msg) {

		var DEFAULT_MESSAGE = i18n.get('server_generic_error');

		res.status(500);
		msg = msg || DEFAULT_MESSAGE;
		redirectError(req, res, err, msg);
	}
	;

	exports.throwNotAllowedError = function(req, res, err, msg) {

		var NOT_ALLOWED_MESSAGE = i18n.get('server_not_allowed');

		res.status(405);
		msg = msg || NOT_ALLOWED_MESSAGE;
		redirectError(req, res, err, msg);
	};

	function redirectError(req, res, err, msg) {

		if (req.xhr) {
			res.send(msg);
		} else {
			var args = {
				message : msg,
				err : err
			};
			view.render(req, res, 'layout/error', 'Erreur', args);
		}
	}
}

// MODULE EXPORTS
module.exports.ErrorController = ErrorController;