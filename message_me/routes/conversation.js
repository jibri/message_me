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
