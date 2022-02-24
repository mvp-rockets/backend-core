
const SQS = require('SQS/get-sqs-client.js')();
const config = require('config/config.js');



module.exports.perform = async () => {
    const { deadLetterQueue } = config.SQS;
    const params = {
        QueueName: deadLetterQueue
    };
    SQS.createQueue(params, (err, data) => {
        if (err) {
            console.log('Error', err);
        } else {
            console.log('Success', data.QueueUrl);
        }
    });
};
