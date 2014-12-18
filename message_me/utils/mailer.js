var nodemailer = require("nodemailer");
var Logger = require(__root + 'utils/logger').Logger;
var SMTPConfig = require(__root + 'public/config/mailer.config');

// LOGGER
var logger = new Logger();

// the transport object which send the mails
var smtpTransport;

// The number of mail sent in one connection
var sentMails = 0;

// Param values
var PARAM = {
	USER : 'USER',
	TITLE : 'TITLE',
	CONTENT : 'CONTENT',
	URL : 'URL'
};

// ------------------
// MODULE.EXPORTS
// ------------------
module.exports.sendMail = sendMail;
module.exports.setParameter = setParameter;
module.exports.param = PARAM;

// ------------------
// FUNCTIONS
// ------------------

/**
 * Send a mail to 'to'.
 * 
 * @param to
 *          The mail adresse where to send the mail. It's a comma separated
 *          list.
 * @param subject
 *          The mail subject.
 * @param content
 *          The mail content.
 */
function sendMail(to, subject, content) {

	if (!smtpTransport) {
		sentMails = 0;
		// create reusable transport method (opens pool of SMTP connections)
		smtpTransport = nodemailer.createTransport("SMTP", SMTPConfig);
	}

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from : SMTPConfig.auth.user,
		to : to.to || to,
		cc : to.cc || '',
		bcc : to.bcc || '',
		subject : subject,
		/* text : 'This email is an HTML email.', */
		html : content
	};

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
				smtpTransport.close(); // shut down the connection pool, no more
																// messages
			}
		}
	});
}

/**
 * Replace the param with the value in the content.
 * 
 * @param content
 *          The content where to replace the param.
 * @param param
 *          The param to replace. To replace the param "PARAM", it MUST be
 *          formed as "[[PARAM]]" in the content.
 * @param value
 *          The value to set.
 */
function setParameter(content, param, value) {

	var rg = new RegExp('\\[\\[' + param + '\\]\\]', 'g');
	return content.replace(rg, value);
}
