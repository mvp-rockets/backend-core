const config = require('config/config.js');
const Result = require('folktale/result');
const mailgun = require('mailgun-js');
const { logError, logInfo } = require('lib');

module.exports.send = (mailOptions) =>
    new Promise((resolve, reject) => {
        const mg = mailgun({ apiKey: config.mailgun.apiKey, domain: config.mailgun.domain });
        const data = {
            from: config.mailgun.senderEmail,
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions?.text,
            inline: mailOptions?.attachment,
            html: mailOptions.html,
        };

        mg.messages().send(data, (error, result) => {
            if (error) {
                logError('Failed to sent email', error);
                resolve(Result.Error(error));
            } else {
                logInfo('Successfully sent email', result);
                resolve(Result.Ok(result));
            }
        });
    });
