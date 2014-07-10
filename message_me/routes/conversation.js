var viewHandler = require('../utils/viewsHandler');
var urlMapping = require('../utils/urlMapping');
var DAO = require('../utils/dbConnection');
var i18n = require('../utils/i18n');
var userModel = require('../model/user');
var convModel = require('../model/conversation');
var msgModel = require('../model/message');
var errors = require('../routes/errors');

/*
 * GET conversation listing view.
 */
exports.getConversation = function(req, res) {

  userModel.getUserId(req, res, function(userId) {

    convModel.findWithUser(userId, function(err, convs) {

      if (err) {
        return errors.throwServerError(req, res, err);
      }

      viewHandler.render(req, res, 'conv/conversation', 'Messages', { conversations : convs });
    });
  });
};

/*
 * GET POPUP conversation form
 */
exports.popupConversationForm = function(req, res) {

  viewHandler.render(req, res, 'conv/conversation-form');
};

/*
 * POST new conversation form
 */
exports.postConversation = function(req, res) {

  var conversationForm = new ConversationForm(mapForm(req.body));
  console.log(conversationForm);
  var json = validateConversationForm(conversationForm)

  if (json) {
    return errors.throwInvalidForm(req, res, '', json);
  }

  userModel.getUserId(req, res, function(userId) {

    // TODO system de parsing avancé + validation 
    conversationForm.users = [ JSON.parse(conversationForm.users) ];
    conversationForm.users.push({ id : userId });
    conversationForm.messages = [ conversationForm.messages ];
    //    conversationForm.messages[0].user = userId;
    //    conversationForm.messages[0].date_send = new Date();
    var conversation = new convModel.conversation(conversationForm);

    DAO.persist(convModel.TABLE_NAME, conversation, function(err, insertedRow) {

      if (err) {
        return errors.throwServerError(req, res, err);
      }

      // TODO retour
      exports.getConversation(req, res);

      //      DAO.persist('tb_message', message, function(msgId) {
      //
      //        if (msgId) {
      //          return errors.throwServerError(req, res);
      //        }
      //
      //        var jointure = {};
      //        jointure.user = userId;
      //        jointure.conversation = convId;
      //
      //        DAO.persist('tj_conv_user', jointure, function(id) {
      //
      //          if (!id) {
      //            return errors.throwServerError(req, res);
      //          }
      //
      //          res.send('Conversation créée.');
      //        });
      //      });
    });
  });
};

/*
 * GET messages listing.
 */
exports.getMessages = function(req, res) {

  var convId = req.query.conversation || 0;

  userModel.getUserId(req, res, function(userId) {

    msgModel.findFromConv(convId, userId, function(err, messages) {

      if (err) {
        return errors.throwServerError(req, res, err);
      }

      viewHandler.render(req, res, 'conv/messages', 'Messages', { messages : messages });
    });
  });
};

/*
 * GET Users for Autocomplete
 */
exports.getUsersAutocomplete = function(req, res) {

  // 'term' is a jquery param used in autocomplete widget
  var query = req.query.term;

  userModel.findUsersLikeName(query, function(err, result) {

    if (err) {
      return errors.throwServerError(req, res, err);
    }

    var values = [];

    for (var i = 0; i < result.length; i++) {

      values[i] = {};
      values[i].value = result[i];
      values[i].label = result[i].firstname + result[i].name;
    }

    res.send(values);
  });
};

//TODO centralize
// TODO en cours validation parsing json retour.
var TYPE_ERROR_TAG = 'type';
var MIN_ERROR_TAG = 'min';
var MAX_ERROR_TAG = 'max';
var NOT_NULL_ERROR_TAG = 'null';

function validateConversationForm(form) {

  var json = {};

  // The form must have a validate attribute
  if (form.validate) {
    var validate = form.validate;

    for (var i = 0; i < validate.length; i++) {

      var fieldName = validate[i].field;
      var fieldType = validate[i].type;
      var fieldMin = validate[i].min;
      var fieldMax = validate[i].max;
      var fieldNotNull = validate[i].notNull;
      console.log("fieldName " + fieldName);
      console.log("fieldType " + fieldType);
      console.log("fieldMin " + fieldMin);
      console.log("fieldMax " + fieldMax);
      console.log("fieldNotNull " + fieldNotNull);

      var fieldValue = form[fieldName];
      console.log("fieldValue " + fieldValue);

      // Type validation
      if (fieldType && !(typeof fieldValue === fieldType)) {
        console.log("type false " + fieldType + " instead of " + typeof fieldValue);

        // Check if array
        if (fieldType === 'array' && !Array.isArray(fieldValue)) {
          console.log("arraytise the field " + fieldName);
          form[fieldName] = [ form[fieldName] ];
        } else {
          json[fieldName] = TYPE_ERROR_TAG;
          continue;
        }
      }

      // NotNull validation
      if (fieldNotNull === true
          && (!fieldValue || fieldValue == '' || fieldValue.trim() === '' || fieldValue.length <= 0)) {
        console.log("notnull false");
        json[fieldName] = NOT_NULL_ERROR_TAG;
        continue;
      }

      // Min validation
      if (fieldMin && fieldValue.length < fieldMin) {
        console.log("min false");
        json[fieldName] = MIN_ERROR_TAG;
        continue;
      }

      // Max validation
      if (fieldMax && fieldValue.length > fieldMax) {
        console.log("max false");
        json[fieldName] = MAX_ERROR_TAG;
        continue;
      }
    }
  }

  if (Object.keys(obj).length > 0) {
    if (form.message) {
      json.message = form.message;
    }
  } else {
    return;
  }

  return json;
}

// TODO centralize
function conversationFormToJSON(form) {

  var json = '{';
  if (!(form.title && form.title.length > 0 && form.title.length <= 200)) {
    json += '"title":"' + i18n.get('validation_required') + '",';
  }
  if (!(form.messages && form.messages.content && form.messages.content.length > 0)) {
    json += '"messages.content":"' + i18n.get('validation_required') + '",';
  }

  var hasUsers = form.users && form.users.length > 0;
  if (hasUsers) {
    for (user in form.users) {
      hasUsers |= user && user.id;
    }
  }
  if (!hasUsers) {
    json += '"users":"' + i18n.get('validation_required') + '",';
  }

  return json;
}

// TODO Centralize
function mapForm(rawForm) {

  var finalForm = {};
  var temp;
  for ( var props in rawForm) {
    temp = finalForm;
    var parts = props.split('.');
    var key = parts.pop();
    while (parts.length) {
      var part = parts.shift();
      temp = temp[part] = temp[part] || {};
    }
    temp[key] = rawForm[props];
  }
  return finalForm;
}

function ConversationForm(form) {

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
}
