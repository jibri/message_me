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

var Logger = require(__root + 'utils/logger').Logger;

/**
 * Index Controller
 * 
 * @constructor
 * @author Jeremie BRIAND
 */
function IndexController() {

	var logger = new Logger('IndexController');

	this.index = function(req, res) {

		req.viewProperties = { name : 'index', title : 'Bienvenue' };
		return next();
	};
}

// MODULE EXPORTS
module.exports.IndexController = IndexController;