/**
 * @constructor Represente the form of the login
 * 
 * @param form
 *          The received form from client side.
 */
module.exports = LoginForm;
function LoginForm(form) {

  this.name = form ? form.name : undefined;
  this.password = form ? form.password : undefined;

  this.validate = [ { field : 'name',
                     type : 'string',
                     notNull : true },

                   { field : 'password',
                    type : 'string',
                    notNull : true } ];
};