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