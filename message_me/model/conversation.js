/**
 * Conversation model object
 */
var mongoose = require('mongoose');

/**
 * Message sub-documents Schema
 */
var messageSchema = mongoose.Schema({
    user : { type : mongoose.Schema.Types.ObjectId, ref : 'User' },
    date : { type : Date, required : true, 'default' : new Date() },
    message : { type : String, required : true } });

/**
 * Conversation schema
 */
var schema = mongoose.Schema({
    title : { type : String, required : true },
    dateCreation : { type : Date, required : true, 'default' : new Date() },
    messages : [ messageSchema ],
    users : [ { type : mongoose.Schema.Types.ObjectId, ref : 'User' } ] });

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