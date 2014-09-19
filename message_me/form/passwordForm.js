/**
 * @constructor Represente the form of the conversation insertion
 * 
 * @param form
 *          The received form from client side.
 */
module.exports = function PasswordForm(form) {

  this.password = form ? form.password : undefined;
  this.confirm = form ? form.confirm : undefined;

  this.validate = [ { field : 'password',
                     type : 'string',
                     max : 200,
                     notNull : true },

                   { field : 'confirm',
                    type : 'string',
                    max : 200,
                    notNull : true } ];
};