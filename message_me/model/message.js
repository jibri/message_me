/**
 * Conversation model object
 */
var user = require(__root + 'model/user');
var dao = require(__root + 'model/base/dbConnection');
var TABLE_NAME = 'tb_message';

module.exports.Message = Message;
module.exports.find = find;
module.exports.findFromConv = findFromConv;
module.exports.TABLE_NAME = TABLE_NAME;

function Message(form) {

  this.tableName = TABLE_NAME;

  this.fields = { content : form.content,
                 date_send : form.date || new Date(),
                 user : form.user.id,
                 conversation : form.conversation.id };

  this.manyToOne = { user : { valueId : 'user',
                             value : form.user },
                    conversation : { valueId : 'conversation',
                                    value : form.conversation } };

  this.validate = [ { field : 'content',
                     type : 'string',
                     max : 3000,
                     notNull : true },

                   { field : 'date_send',
                    type : 'date',
                    notNull : true },

                   { field : 'user',
                    type : 'object',
                    notNull : true },

                   { field : 'conversation',
                    type : 'object',
                    notNull : true } ];
}

/**
 * find the conversation with the given params.
 */
function find(params, callback) {

  dao.find(TABLE_NAME, params, callback);
}

/**
 * find the messages which belongs to the given conversation id.
 */
function findFromConv(convId, userId, callback) {

  var query = 'SELECT message.content, message.date_send, "user".firstname user_firstname FROM ' + TABLE_NAME
      + ' message ';
  query += 'JOIN ' + user.TABLE_NAME + ' "user" ON message.user = "user".id ';
  query += 'WHERE message.conversation = ' + convId;

  // sub query to check if connected user is part of the conversation
  query += ' AND ' + userId + ' IN ';
  query += '(SELECT usr.id FROM tb_user usr	';
  query += 'JOIN tj_conv_user tcu ON tcu.user = usr.id ';
  query += 'WHERE tcu.conversation = ' + convId + ')';

  query += ' ORDER BY message.date_send DESC';

  dao.findQuery(query, callback);
}