/*
 * GET home page.
 */
var viewHandler = require(__root + 'routes/base/viewsHandler.js');

function IndexController() {

	this.index = function(req, res) {

		viewHandler.render(req, res, 'index', 'Bienvenue');
	};
}

// MODULE EXPORTS
module.exports.IndexController = IndexController;