/*
 * Error handler
 */
var view = require(__root + 'routes/base/viewsHandler');
var i18n = require(__root + 'utils/i18n');

exports.throwInvalidForm = function(req, res, err, json) {

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
};

exports.throwServerError = function(req, res, err, msg) {

  var DEFAULT_MESSAGE = i18n.get('server_generic_error');

  res.status(500);
  msg = msg || DEFAULT_MESSAGE;
  redirectError(req, res, err, msg);
};

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
    var args = { message : msg,
                err : err };
    view.render(req, res, 'layout/error', 'Erreur', args);
  }
}