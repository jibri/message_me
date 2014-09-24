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