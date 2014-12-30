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
 * @constructor Represente the form of the user insertion
 * 
 * @param form
 *          The received form from client side.
 */
module.exports = function UserForm(form) {

  this.name = form ? form.name : undefined;
  this.firstname = form ? form.firstname : undefined;
  this.password = form ? form.password : undefined;
  this.mail = form ? form.mail : undefined;

  this.validate = [ { field : 'name',
                     type : 'string',
                     max : 30,
                     notNull : true },

                   { field : 'firstname',
                    type : 'string',
                    max : 30,
                    notNull : true },

                   { field : 'password',
                    type : 'string',
                    notNull : true },

                   { field : 'mail',
                    type : 'string',
                    max : 250,
                    notNull : true } ];
};