/**
 *        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2004 Jeremie Briand <jeremie.briand@outlook.fr>
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 */

/**
 * The Views handler object
 * 
 * @constructor
 */
function ViewRender() {
    // Nothing;
}

/**
 * Render the view, using the {@code viewProperties} property in the request
 * req.<br>
 * 
 * <pre>
 *  req.viewProperties = {
 *  
 *      name: &quot;The name of the view file as a String&quot;,
 *      title: &quot;The title of the view as String&quot;,
 *      args: An object of elements to populate the view,
 *      
 *      body: if the req contains already a body property, this String id directly sent to the client without handling.
 *      It may be an ajax message for exemple.
 *      
 *      redirect: if set as String, the response is redirected to the given url.
 *  }
 * </pre>
 * 
 * @param req
 *            The http request
 * @param res
 *            The http response
 * @param next
 *            The next middleware
 */
function render(req, res, next) {
    
    // viewName, title, args
    var properties = req.viewProperties || {};

    // We only handle a res.send(message)
    if (properties.body) {
        
        res.send(properties.body);
        return;
    }

    // We only handle a res.redirect(url)
    if (properties.redirect) {
        
        res.redirect(properties.redirect);
        return;
    }
    
    properties.lang = req.app.get('lang');
    properties.title = properties.title || 'Message_Me';
    properties.connected = req.session ? req.session.connected : false;
    properties.firstname = req.session.userFirstname || 'anonymous';

    res.render(properties.name, properties);
}

// STATIC METHODS
ViewRender.render = render;

// MODULE EXPORTS
module.exports = ViewRender;