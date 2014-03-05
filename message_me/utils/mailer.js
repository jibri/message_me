var nodemailer = require("nodemailer");
var SMTPConfig = require('../public/config/mailer.config');

var smtpTransport;
var sentMails = 0;

exports.sendMail = function(from, to, subject, content) {

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
      console.log(error);
    } else {
      console.log("Message sent: " + response.message);

      if (sentMails === 0) {
        console.log('close smtp transport.');
        smtpTransport.close(); // shut down the connection pool, no more messages
      }
    }
  });
};