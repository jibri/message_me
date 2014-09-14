/**
 * Conversation model object
 */

// --------------------------------------------------
// TODO Use Conversation.prototype and a mother Entity class to set 'id' field' and dao methods.
// --------------------------------------------------
var user = require(__root + 'model/user');
var message = require(__root + 'model/message');
var dao = require(__root + 'model/base/dbConnection');
var ConversationForm = require(__root + 'form/conversationForm');

var TABLE_NAME = 'tb_conversation';
var JOIN_CONV_USER = 'tj_conv_user';

module.exports.Conversation = Conversation;

module.exports.find = find;
module.exports.findWithUser = findWithUser;
module.exports.TABLE_NAME = TABLE_NAME;

function Conversation(form) {

  if (!form) {
    form = new ConversationForm();
  }

  this.tableName = TABLE_NAME;

  this.fields = { titre : form.title,
                 date_ouverture : form.date || new Date() };

  this.manyToMany = { users : { joinTableName : JOIN_CONV_USER,
                               tableName : user.TABLE_NAME,
                               thisId : 'conversation',
                               valueId : 'user',
                               values : form.users } };

  this.oneToMany = { messages : { tableName : message.TABLE_NAME,
                                 thisId : 'conversation',
                                 values : form.messages } };

  this.validate = [ { field : 'title',
                     type : String,
                     max : 200,
                     notNull : true },

                   { field : 'date',
                    type : Date,
                    notNull : true },

                   { field : 'users',
                    type : Array,
                    min : 1,
                    notNull : true },

                   { field : 'messages',
                    type : Array,
                    min : 1,
                    notNull : true } ];
}

/**
 * find the conversation with the given params.
 */
function find(params, callback) {

  dao.find(TABLE_NAME, params, callback);
}

/**
 * find the conversations with the given user participant.
 */
function findWithUser(userId, callback) {

  var query = 'SELECT conversation.* FROM ' + TABLE_NAME + ' conversation ';
  query += 'JOIN ' + JOIN_CONV_USER + ' jcu ON conversation.id = jcu.conversation ';
  query += 'JOIN ' + user.TABLE_NAME + ' "user" ON jcu.user = "user".id ';
  query += 'WHERE "user".id = ' + userId;
  query += ' ORDER BY conversation.date_ouverture DESC';

  dao.findOptions(query, new Conversation(), null, function(err, result) {

    callback(err, result);
  });
}