/*
 * GET home page.
 */
var viewHandler = require(__root + 'utils/viewsHandler.js');

exports.index = function(req, res) {

  viewHandler.render(req, res, 'index', 'Bienvenue');
};