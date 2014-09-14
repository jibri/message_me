var nodemailer = require("nodemailer");
var Logger = require(__root + 'utils/logger').Logger;
var SMTPConfig = require(__root + 'public/config/mailer.config');

// LOGGER
var logger = new Logger();

// the transport object which send the mails
var smtpTransport;

// The number of mail sent in one connection
var sentMails = 0;

module.exports.sendMail = function(from, to, subject, content) {

  if (!smtpTransport) {
    sentMails = 0;
    // create reusable transport method (opens pool of SMTP connections)
    smtpTransport = nodemailer.createTransport("SMTP", SMTPConfig);
  }

  // setup e-mail data with unicode symbols
  var mailOptions = { from : from,
                     to : to.to || to,
                     cc : to.cc || '',
                     bcc : to.bcc || '',
                     subject : subject,
                     text : 'This email is an HTML email.',
                     html : content };

  sentMails++;
  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response) {

    sentMails--;
    if (error) {
      logger.logError('Error while sending mail :');
      logger.logError(error);
    } else {
      logger.logDebug("Message sent: " + response.message);

      if (sentMails === 0) {
        logger.logDebug('close smtp transport.');
        smtpTransport.close(); // shut down the connection pool, no more messages
      }
    }
  });
};