var userModel = require(__root + 'model/user');
var convModel = require(__root + 'model/conversation');
var Conversation = convModel.Conversation;
var msgModel = require(__root + 'model/message');
var Message = msgModel.Message;
var errors = require(__root + 'routes/errorsController');
var viewHandler = require(__root + 'routes/base/viewsHandler');
var urlMapping = require(__root + 'routes/base/urlMapping');
var DAO = require(__root + 'model/base/dbConnection');
var i18n = require(__root + 'utils/i18n');
var Logger = require(__root + 'utils/logger').Logger;
var mailer = require(__root + 'utils/mailer');
var forms = require(__root + 'form/formValidation');
var ConversationForm = require(__root + 'form/conversationForm');
var MessageForm = require(__root + 'form/messageForm');
var util = require('util');

// LOGGER
var logger = new Logger();

/**
 * GET conversation listing view.
 */
exports.getConversation = function(req, res) {

  console.log(urlMapping.resolveUrl(req, urlMapping.CONVERSATION));
  convModel.findWithUser(req.session.userId, function(err, convs) {

    if (err) {
      logger.logError('An error occured while findind conversations list : ' + err);
      return errors.throwServerError(req, res, err);
    }

    viewHandler.render(req, res, 'conv/conversation', 'Messages', { conversations : convs });
  });
};

/**
 * GET POPUP conversation form
 */
exports.popupConversationForm = function(req, res) {

  viewHandler.render(req, res, 'conv/conversation-form');
};

/**
 * POST new conversation form
 */
exports.postConversation = function(req, res) {

  var conversationForm = new ConversationForm(forms.mapForm(req.body));
  var json = forms.validateForm(conversationForm);

  if (json) {
    return errors.throwInvalidForm(req, res, '', json);
  }

  // FIXME there must be better way
  conversationForm.users.push({ id : req.session.userId });
  for ( var i = 0; i < conversationForm.users.length; i++) {
    try {
      conversationForm.users[i] = JSON.parse(conversationForm.users[i]);
    } catch (e) {
      // DO NOTHING
    }
  }

  conversationForm.messages[0].user = req.session.userId;
  conversationForm.messages[0].date_send = new Date();

  var conversation = new Conversation(conversationForm);

  DAO.persist(conversation, function(err, insertedRow) {

    if (err || !insertedRow) {
      logger.logError('An error occured while persisting entity "conversation" : ' + err);
      return errors.throwServerError(req, res, err);
    }

    var users = insertedRow.users;
    var header = i18n.get('mail_new_conversation_header');
    var mailContent = i18n.get('mail_new_conversation_content');

    mailContent = mailer.setParameter(mailContent, mailer.param.USER, req.session.userName);
    mailContent = mailer.setParameter(mailContent, mailer.param.TITLE, insertedRow.titre);
    mailContent = mailer.setParameter(mailContent, mailer.param.CONTENT, conversationForm.messages[0].content);
    mailContent = mailer.setParameter(mailContent, mailer.param.URL, urlMapping
        .resolveUrl(req, urlMapping.CONVERSATION));

    if (users && util.isArray(users)) {

      for ( var i = 0; i < users.length; i++) {

        if (req.session.userId !== users[i].id) {
          mailer.sendMail(users[i].mail, header, mailContent);
        }
      }
    }

    res.send('OK');
  });
};

/**
 * GET messages listing.
 */
exports.getMessages = function(req, res) {

  var convId = req.query.conversation || 0;

  msgModel.findFromConv(convId, req.session.userId, function(err, messages) {

    if (err) {
      logger.logError('An error occured while findind messages list : ' + err);
      return errors.throwServerError(req, res, err);
    }

    viewHandler.render(req, res, 'conv/messages', 'Messages', { messages : messages });
  });
};

/**
 * GET Users for Autocomplete
 */
exports.getUsersAutocomplete = function(req, res) {

  // 'term' is a jquery param used in autocomplete widget
  var query = req.query.term;

  userModel.findUsersLikeName(query, function(err, result) {

    if (err) {
      logger.logError("An error occured while findind Users for autocomplete field : " + err);
      return errors.throwServerError(req, res, err);
    }

    var values = [];
    var j = 0;

    for ( var i = 0; i < result.length; i++) {

      // Don't take connected user.
      if (result[i].id === req.session.userId) {
        continue;
      }

      values[j] = {};
      values[j].value = result[i];
      values[j].label = result[i].firstname + ' ' + result[i].name;
      j++;
    }

    res.send(values);
  });
};

/**
 * POST the message in the conversation
 */
exports.postMessage = function(req, res) {

  var messageForm = new MessageForm(forms.mapForm(req.body));
  var json = forms.validateForm(messageForm);

  if (json) {
    return errors.throwInvalidForm(req, res, '', json);
  }

  messageForm.user = { id : req.session.userId };

  var message = new Message(messageForm);

  DAO.persist(message, function(errInsert, insertedMessage) {

    if (errInsert) {
      return errors.throwServerError(req, res, errInsert);
    }

    DAO.find(new Conversation(), { id : insertedMessage.conversation }, function(errSelect, conversation) {

      if (errSelect) {
        return errors.throwServerError(req, res, errSelect);
      }

      var users = conversation[0].users;
      var header = i18n.get('mail_new_message_header');
      var mailContent = i18n.get('mail_new_message_content');

      mailContent = mailer.setParameter(mailContent, mailer.param.USER, req.session.userName);
      mailContent = mailer.setParameter(mailContent, mailer.param.TITLE, conversation[0].titre);
      mailContent = mailer.setParameter(mailContent, mailer.param.CONTENT, insertedMessage.content);
      mailContent = mailer.setParameter(mailContent, mailer.param.URL, urlMapping.resolveUrl(req,
          urlMapping.CONVERSATION));

      if (users && util.isArray(users)) {
        for ( var i = 0; i < users.length; i++) {

          if (req.session.userId !== users[i].id) {
            mailer.sendMail(users[i].mail, header, mailContent);
          }
        }
      }

      res.send('OK');
    });
  });
};
