/**
 * @constructor Represente the form of the conversation insertion
 * 
 * @param form
 *          The received form from client side.
 */
module.exports = function ConversationForm(form) {

  this.title = form ? form.title : undefined;
  this.messages = form ? form.messages : undefined;
  this.users = form ? form.users : undefined;

  this.validate = [ { field : 'title',
                     type : 'string',
                     max : 200,
                     notNull : true },

                   { field : 'users',
                    type : 'array',
                    notNull : true },

                   { field : 'messages',
                    type : 'array',
                    notNull : true } ];
};