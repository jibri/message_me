var viewHandler = require('../utils/viewsHandler');
var urlMapping = require('../utils/urlMapping');
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
 * POST conversation form
 */
exports.popupConversationForm = function(req, res) {

  viewHandler.render(req, res, 'conv/conversation-form');
};

/*
 * POST new conversation form
 */
exports.postConversation = function(req, res) {

  var conversationForm = req.body;

  if (!validateConversationForm(conversationForm)) {
    var json = conversationFormToJSON(conversationForm);
    return errors.throwInvalidForm(req, res, '', json);
  }

  userModel.getUserId(req, res, function(userId) {

    var conversation = {};
    conversation.titre = conversationForm.title;
    conversation.date_ouverture = new Date();

    mysql.persist('tb_conversation', conversation, function(convId) {

      if (!convId) {
        return errors.throwServerError(req, res);
      }

      var message = {};
      message.content = conversationForm.content;
      message.user = userId;
      message.date_send = new Date();
      message.conversation = convId;

      mysql.persist('tb_message', message, function(msgId) {

        if (!msgId) {
          return errors.throwServerError(req, res);
        }

        var jointure = {};
        jointure.user = userId;
        jointure.conversation = convId;

        mysql.persist('tj_conv_user', jointure, function(id) {

          if (!id) {
            return errors.throwServerError(req, res);
          }

          res.send('Conversation créée.');
        });
      });
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

function validateConversationForm(form) {

  var hasTitle = form.title && form.title.length > 0 && form.title.length <= 200;
  var hasMsg = form.content && form.content.length > 0;
  return hasTitle && hasMsg;
}

function conversationFormToJSON(form) {

  var json = '{';
  if (!(form.title && form.title.length > 0 && form.title.length < 200)) {
    json += '"title":"' + i18n.get('validation_required') + '",';
  }
  if (!(form.content && form.content.length)) {
    json += '"content":"' + i18n.get('validation_required') + '",';
  }

  return json;
}
