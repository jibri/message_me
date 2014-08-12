var userModel = require(__root + 'model/user');
var convModel = require(__root + 'model/conversation');
var msgModel = require(__root + 'model/message');
var errors = require(__root + 'routes/errorsController');
var viewHandler = require(__root + 'utils/viewsHandler');
var urlMapping = require(__root + 'utils/urlMapping');
var DAO = require(__root + 'utils/dbConnection');
var i18n = require(__root + 'utils/i18n');
var logger = require(__root + 'utils/logger');
var mailer = require(__root + 'utils/mailer');
var forms = require(__root + 'form/formValidation');
var ConversationForm = require(__root + 'form/conversationForm');
var MessageForm = require(__root + 'form/messageForm');

/**
 * GET conversation listing view.
 */
exports.getConversation = function(req, res) {

  convModel.findWithUser(req.session.userId, function(err, convs) {

    if (err) {
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

  var conversation = new convModel(conversationForm);

  DAO.persist(convModel.TABLE_NAME, conversation, function(err, insertedRow) {

    if (err) {
      return errors.throwServerError(req, res, err);
    }

    // mailer.sendMail('Me', 'grmdu44@hotmail.com', 'test subject', 'test<br/>content');

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
      values[j].label = result[i].firstname + result[i].name;
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

  var message = new msgModel(messageForm);

  DAO.persist(msgModel.TABLE_NAME, message, function(err, insertedRow) {

    if (err) {
      return errors.throwServerError(req, res, err);
    }

    res.send('OK');
  });
};
