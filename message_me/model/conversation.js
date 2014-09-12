/**
 * Conversation model object
 */
var user = require(__root + 'model/user');
var message = require(__root + 'model/message');
var dao = require(__root + 'utils/dbConnection');

var TABLE_NAME = 'tb_conversation';
var JOIN_CONV_USER = 'tj_conv_user';

module.exports.Conversation = Conversation;

module.exports.find = find;
module.exports.findWithUser = findWithUser;
module.exports.TABLE_NAME = TABLE_NAME;

function Conversation(form) {

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
// FIXME centralize it
function findWithUser(userId, callback) {

  var query = 'SELECT conversation.id, conversation.titre, conversation.date_ouverture FROM ' + TABLE_NAME
      + ' conversation ';
  query += 'JOIN ' + JOIN_CONV_USER + ' jcu ON conversation.id = jcu.conversation ';
  query += 'JOIN ' + user.TABLE_NAME + ' "user" ON jcu.user = "user".id ';
  query += 'WHERE "user".id = ' + userId;
  query += ' ORDER BY conversation.date_ouverture DESC';

  dao.findQuery(query, function(err, result) {

    if (err) {
      return callback(err);
    }

    var inArray = new Array();
    for ( var i = 0; i < result.length; i++) {
      inArray.push(result[i].id);
    }

    if (inArray.length === 0) {
      callback(null, result);
      return;
    }

    var innerQuery = 'SELECT jcu.conversation conversation_id, "user".firstname user_firstname FROM ' + JOIN_CONV_USER
        + ' jcu ';
    innerQuery += 'JOIN ' + user.TABLE_NAME + ' "user" ON jcu.user = "user".id ';
    innerQuery += 'WHERE jcu.conversation IN (' + inArray.join(',') + ')';

    dao.findQuery(innerQuery, function(errFind, innerResult) {

      if (errFind) {
        return callback(errFind);
      }

      for ( var i = 0; i < result.length; i++) {
        var innerArray = [];
        for ( var j = 0; j < innerResult.length; j++) {
          if (result[i].id == innerResult[j].conversation_id) {
            innerArray.push(innerResult[j].user_firstname);
          }
        }
        result[i].users = innerArray;
      }

      callback(null, result);
    });
  });
}