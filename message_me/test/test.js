/**
 * for https, see http://www.hacksparrow.com/node-js-https-ssl-certificate.html
 */

/**
 * Module dependencies.
 */
var appConfig = require('../public/config/app.config');
var express = require('express');
var routes = require('../routes');
var login = require('../routes/login');
var user = require('../routes/user');
var conversation = require('../routes/conversation');
var http = require('http');
var path = require('path');
var moment = require('moment');
var urlMapping = require('../utils/urlMapping');
var i18n = require('../utils/i18n');
var DAO = require('../utils/dbConnection');
var convModel = require('../model/conversation');

var app = express();

app.configure(function() {

  app.set('port', appConfig.port);

  // views dir for express "res.render()"
  app.set('views', path.join(__dirname, 'views'));
  // views dir for jade files (for include & extends statements)
  app.locals.basedir = app.get('views');
  app.set('view engine', appConfig.viewEngine);

  // moment.js
  moment.lang(appConfig.lang);
  app.locals.moment = moment;

  // I18N messages
  i18n.lang(appConfig.lang);
  app.locals.i18n = i18n;

  // Url mapping in locals
  app.locals.url = urlMapping;

  app.use(express.favicon('public/images/favicon.png'));
  // logger
  app.use(express.logger(appConfig.log));
  // pour récupérer les éléments d'un formulaire avec req.body.<name>
  app.use(express.bodyParser());

  // The 2 next lines goes together in order to keep object in session as cookies.
  app.use(express.cookieParser('C00ki3s-S3cr3t'));
  app.use(express.session());

  // Indique que "/public" contient des fichiers statics (convention)
  app.use(express.static(path.join(__dirname, 'public')));

});

http.createServer(app).listen('3002', function() {

  console.log("Express test server listening on port 3002");
  testValidateForm();
});

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

  var form = { /* title : 'aze', */
    number : 3,
    messages : { content : 'azeaze' },
    users : '{"id":2,"name":"a                             ","firstname":"a                             "}',
    validate : [ { field : 'title',
                  type : 'string',
                  max : 2,
                  notNull : true },
                { field : 'number',
                 type : 'number',
                 max : 2,
                 min : 0 },
                { field : 'users',
                 type : 'array',
                 notNull : true },
                { field : 'messages',
                 type : 'array',
                 notNull : true } ] };

  console.log(validateConversationForm(form));

}

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

      // NotNull validation
      if (fieldNotNull === true) {
        if (!fieldValue || fieldValue == '' || (fieldValue.trim && fieldValue.trim()) === '' || fieldValue.length <= 0) {
          console.log("notnull false");
          json[fieldName] = "NOT_NULL_ERROR_TAG";
          continue;
        }
      }

      // Type validation
      if (fieldType && !(typeof fieldValue === fieldType)) {
        console.log("type false " + fieldType + " instead of " + typeof fieldValue);

        // Check if array
        if (fieldType === 'array' && !Array.isArray(fieldValue)) {
          console.log("arraytise the field " + fieldName);
          form[fieldName] = [ form[fieldName] ];
        } else {
          json[fieldName] = "TYPE_ERROR_TAG";
          continue;
        }
      }

      // Min validation
      if (fieldMin) {
        if (fieldType === 'number' && fieldValue < fieldMin || fieldValue.length < fieldMin) {
          console.log("min false");
          json[fieldName] = "MIN_ERROR_TAG";
          continue;
        }
      }

      // Max validation
      if (fieldMax) {
        if (fieldType === 'number' && fieldValue > fieldMax || fieldValue.length > fieldMax) {
          console.log("max false");
          json[fieldName] = "MAX_ERROR_TAG";
          continue;
        }
      }
    }
  }

  if (Object.keys(json).length > 0) {
    if (form.message) {
      json.message = form.message;
    }
  } else {
    return;
  }

  return json;
}

function testJSONParsing() {

  //  console.log(JSON.parse('hello')); // Error

  var output = JSON.parse('"hello"');
  console.log(output);
  console.log(typeof output);
  console.log('');

  //  console.log(JSON.parse('')); // Error

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

  //  console.log(JSON.parse({})); // Error

  output = JSON.parse('{ "prop" : "value" }');
  console.log(output);
  console.log(typeof output);
  console.log('');

  output = JSON.parse('{ "prop" : "value", "prop2" : { "subProp" : "subValue" } }');
  console.log(output);
  console.log(typeof output);
  console.log('');

  //  output = JSON.parse([ { prop : 'value' } ]); // Error

  output = JSON.parse('[ { "prop" : "value" } ]');
  console.log(output);
  console.log(typeof output);
  console.log('');

  output = JSON.parse('[ "hello", 2 ]');
  console.log(output);
  console.log(typeof output);
  console.log('');

  // ------------------------
  //   STRINGIFY
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
  var output2 = JSON.parse(output)
  console.log(output2);
  console.log(typeof output2);
  console.log('');
  for ( var prop in output2) {
    console.log(prop + ' ' + output2[prop]);
  }
}
