var viewHandler = require('../utils/viewsHandler');
var urlMapping = require('../utils/urlMapping');
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
 * POST user form
 */
exports.postConversation = function(req, res) {

  userModel.getUserId(req, res, function(userId) {

    var conversation = {};
    conversation.titre = req.body.title;
    conversation.date_ouverture = new Date();

    mysql.persist('tb_conversation', conversation, function(convId) {

      if (!convId) {
        return errors.throwServerError(req, res);
      }

      var message = {};
      message.content = req.body.content;
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
