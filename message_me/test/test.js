var app = require('../app');
testMailer();

// --------------------------------------------
//
// TEST FUNCTIONS
//
// --------------------------------------------

function testInsertConversation() {

  var form = {};
  form.title = 'titre test';
  form.date = new Date();
  form.users = [ { id : '1' } ];
  form.messages = [ { content : 'message test',
                     user : 1,
                     date_send : new Date() } ];

  var conversation = new convModel.conversation(form);

  DAO.persist(convModel.TABLE_NAME, conversation, function(err, result) {

    console.log(err);
    console.log(result);
  });
}

function testValidateForm() {

  var validator = require('../form/formValidation');
  var cf = require('../form/conversationForm');

  var rawForm = { title : 'aty',
                 // ' qsqs',
                 // 2 ],
                 // number : 3,
                 messages : { content : 'azeaze' },
                 users : '{"id":2,"name":"a                             ","firstname":"a                             "}' };

  var form = new cf(rawForm);

  console.log(validator.validateForm(form));
}

function testLogging() {

  var logger = require(__root + 'utils/logger');

  // logger.setLogLevel(logger.LOG_LEVELS.INFO);
  // logger.setLogLevel(logger.LOG_LEVELS.DEBUG);
  // logger.setLogLevel(logger.LOG_LEVELS.ERROR);
  // logger.setLogLevel(logger.LOG_LEVELS.NONE);
  // logger.setLogLevel('INFO');
  // logger.setLogLevel('DEBUG');
  // logger.setLogLevel('ERROR');
  // logger.setLogLevel('NONE');

  logger.logInfo('premier message');
  logger.logDebug('second message');
  logger.logError('third message');
}

function testMailer() {

  var mailer = require(__root + 'utils/mailer');

  mailer.sendMail('donotreply@msgme.com', 'grmdu44@hotmail.com,grmdu44+2@hotmail.com', 'test subject',
      'test<br/>content');
  // mailer.sendMail('donotreply@msgme.com', 'grmdu44+2@hotmail.com', 'test subject', 'test<br/>content');
  // mailer.sendMail('donotreply@msgme.com', 'grmdu44+3@hotmail.com', 'test subject', 'test<br/>content');
}

function testJSONParsing() {

  // console.log(JSON.parse('hello')); // Error

  var output = JSON.parse('"hello"');
  console.log(output);
  console.log(typeof output);
  console.log('');

  // console.log(JSON.parse('')); // Error

  output = JSON.parse('""');
  console.log(output);
  console.log(typeof output);
  console.log('');

  output = JSON.parse(0);
  console.log(output);
  console.log(typeof output);
  console.log('');
  output = JSON.parse(1);
  console.log(output);
  console.log(typeof output);
  console.log('');
  output = JSON.parse(-1);
  console.log(output);
  console.log(typeof output);
  console.log('');

  // console.log(JSON.parse({})); // Error

  output = JSON.parse('{ "prop" : "value" }');
  console.log(output);
  console.log(typeof output);
  console.log('');

  output = JSON.parse('{ "prop" : 2, "prop2" : { "subProp" : "subValue" } }');
  console.log(output);
  console.log(typeof output);
  console.log('');

  // output = JSON.parse([ { prop : 'value' } ]); // Error

  output = JSON.parse('[ { "prop" : "value" } ]');
  console.log(output);
  console.log(typeof output);
  console.log('');

  output = JSON.parse('[ "hello", 2 ]');
  console.log(output);
  console.log(typeof output);
  console.log('');

  // output = JSON.parse([ "hello",
  // 2 ]);
  // console.log(output);
  // console.log(typeof output);
  // console.log('');

  // output = JSON.parse([]);
  // console.log(output);
  // console.log(typeof output);
  // console.log('');

  // ------------------------
  // STRINGIFY
  // ------------------------

  output = JSON.stringify({ prop : 'value',
                           prop2 : { subProp : 'subValue' } });
  console.log(output);
  console.log(typeof output);
  console.log('');

  output = JSON.stringify('{ prop : "value", prop2 : { subProp : "subValue" } }');
  console.log(output);
  console.log(typeof output);
  console.log('');
  var output2 = JSON.parse(output);
  console.log(output2);
  console.log(typeof output2);
  console.log('');
  for ( var prop in output2) {
    console.log(prop + ' ' + output2[prop]);
  }
}