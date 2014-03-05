/**
 * Conversation model object
 */
var mysql = require('../utils/dbConnection');
var user = require('../model/user');
var TABLE_NAME = 'tb_message';

exports.find = find;
exports.findFromConv = findFromConv;

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
 * find the messages which belongs to the given conversation id.
 */
function findFromConv(convId, userId, callback) {

  var query = 'SELECT * FROM ' + TABLE_NAME + ' message ';
  query += 'JOIN ' + user.TABLE_NAME + ' user ON message.user = user.id ';
  query += 'WHERE message.conversation = ' + convId;

  // sub query to check if connected user is part of the conversation
  query += ' AND ' + userId + ' IN ';
  query += '(SELECT usr.id FROM tb_user usr	';
  query += 'JOIN tj_conv_user tcu ON tcu.user = usr.id ';
  query += 'WHERE tcu.conversation = ' + convId + ')';

  query += ' ORDER BY message.date_send DESC';

  var option = { sql : query,
                nestTables : true };

  mysql.findOptions(option, callback);
}