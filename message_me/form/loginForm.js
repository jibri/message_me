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
 * @constructor Represente the form of the login
 * 
 * @param form
 *          The received form from client side.
 */
module.exports = LoginForm;
function LoginForm(form) {

  this.login = form ? form.login : undefined;
  this.password = form ? form.password : undefined;

  this.validate = [ { field : 'login',
                     type : 'string',
                     notNull : true },

                   { field : 'password',
                    type : 'string',
                    notNull : true } ];
}