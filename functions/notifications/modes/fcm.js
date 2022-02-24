const { logInfo, logError } = require('lib');
const FcmNotification = require('fcm-notification');
const config = require('config/config.js');

// const FCM = new FcmNotification(require(config.fcm.path));
const Result = require('folktale/result');

module.exports.send = async (details) => {
    logInfo('Fcm notification : request to send notification', details);
    // return new Promise((resolve) => {
    //     const message = {
    //         data: details.data,
    //         notification: {
    //             title: details.title,
    //             body: details.body
    //         },
    //         token: details.token
    //     };
    //     FCM.send(message, (err, response) => {
    //         if (err) {
    //             logError('error found', err);
    //             resolve(Result.Error(err));
    //         } else {
    //             logInfo('notification response here', response);
    //             resolve(Result.Ok(response));
    //         }
    //     });
    // });
};
