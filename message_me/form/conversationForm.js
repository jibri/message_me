/**
 * @constructor Represente the form of the conversation insertion
 * 
 * @param form
 *          The received form from client side.
 */
module.exports = function ConversationForm(form) {

  this.title = form.title;
  this.messages = form.messages;
  this.users = form.users;

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