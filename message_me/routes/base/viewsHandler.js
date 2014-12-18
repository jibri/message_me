/**
 * Prepare and send the views
 */

exports.render = function(req, res, viewName, title, args) {

	if (!args) {
		args = {};
	}

	args.title = title || 'Message_Me';
	args.connected = req.session ? req.session.connected : false;
	args.firstname = req.session.userFirstname || 'anonymous';
	res.render(viewName, args);
};