/**
 *        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2004 Jeremie Briand <jeremie.briand@outlook.fr>
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 */
var mongoose = require('mongoose');

/**
 * Conversation model object
 */

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