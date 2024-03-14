const SQS = require('SQS/get-sqs-client')();
const config = require('config/config').serviceProviderConfig.awsSQS;

module.exports.perform = async () => {
    const { deadLetterQueue } = config;
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
