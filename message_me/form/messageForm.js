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
 *          The received form from client side.
 */
module.exports = function MessageForm(form) {

  this.content = form.content;
  this.user = form.user;
  this.conversation = form.conversation;
  this.date = form.date;

  this.validate = [ { field : 'content',
                     type : 'string',
                     max : 3000,
                     notNull : true },
                   { field : 'conversation',
                    type : 'object',
                    notNull : true } ];
};