/**
 * Conversation model object
 */
var mysql = require('../utils/dbConnection');
var user = require('../model/user');
var TABLE_NAME = 'tb_conversation';
var JOIN_CONV_USER = 'tj_conv_user';

exports.find = find;
exports.findWithUser = findWithUser;

function validate() {

  // TODO implement validation
  var notNull = false;
  return notNull;
}

/**
 * find the conversation with the given params.
 */
function find(params, callback) {

  mysql.find(TABLE_NAME, params, callback);
}

/**
 * find the conversations with the given user participant.
 */
function findWithUser(userId, callback) {

  var query = 'SELECT conversation.id, conversation.titre, conversation.date_ouverture FROM ' + TABLE_NAME
      + ' conversation ';
  query += 'JOIN ' + JOIN_CONV_USER + ' jcu ON conversation.id = jcu.conversation ';
  query += 'JOIN ' + user.TABLE_NAME + ' "user" ON jcu.user = "user".id ';
  query += 'WHERE "user".id = ' + userId;
  query += ' ORDER BY conversation.date_ouverture DESC';

  mysql.findQuery(query, function(err, result) {

    if (err) {
      return callback(err);
    }

    var inArray = '(';
    for ( var i = 0; i < result.length; i++) {
      if (i !== 0) {
        inArray += ', ';
      }
      inArray += result[i].id;
    }
    inArray += ')';

    var innerQuery = 'SELECT jcu.conversation conversation_id, "user".firstname user_firstname FROM ' + JOIN_CONV_USER
        + ' jcu ';
    innerQuery += 'JOIN ' + user.TABLE_NAME + ' "user" ON jcu.user = "user".id ';
    innerQuery += 'WHERE jcu.conversation IN ' + inArray;

    mysql.findQuery(innerQuery, function(err, innerResult) {

      if (err) {
        return callback(err);
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