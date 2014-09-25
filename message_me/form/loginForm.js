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