/*
 * GET home page.
 */
var viewHandler = require('../utils/viewsHandler.js');

exports.index = function(req, res) {

  viewHandler.render(req, res, 'index', 'Bienvenue');
};