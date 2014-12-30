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
 * @constructor Represente the form of the conversation insertion
 * 
 * @param form
 *            The received form from client side.
 */
module.exports = function ConversationForm(form) {

    this.title = form ? form.title : undefined;
    this.messages = form ? form.messages : undefined;
    this.users = form ? form.users : undefined;

    this.validate = [ { field : 'title', type : 'string', max : 200, notNull : true },

    { field : 'users', type : 'array', notNull : true },

    { field : 'messages', type : 'array', notNull : true } ];
};