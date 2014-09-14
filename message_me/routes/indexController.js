/*
 * GET home page.
 */
var viewHandler = require(__root + 'routes/base/viewsHandler.js');

exports.index = function(req, res) {

  viewHandler.render(req, res, 'index', 'Bienvenue');
};