const nodemailer = require('nodemailer');
const Result = require('folktale/result');
const { logError, logInfo } = require('lib');
const config = require('config/config.js');


module.exports.send = mailOptions => new Promise((resolve) => {
    logInfo('Sending email', {
        to: mailOptions.to,
        from: '',
        subject: mailOptions.subject,
        html: mailOptions.html
    });

    const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: Number(config.smtp.port),
        secure: true,
        auth: {
            user: config.smtp.username,
            pass: config.smtp.password
        }
    });

    transporter.sendMail({
        from: config.smtp.emailFrom,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html
    }, (error, result) => {
        if (error) {
            logError('Failed to sent email', error);
            resolve(Result.Error(error));
        } else {
            logInfo('Successfully sent email', result);
            resolve(Result.Ok(result));
        }
    });
});
