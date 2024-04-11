const SQS = require('SQS/get-sqs-client')();
const config = require('config/config').serviceProviderConfig.awsSQS;

module.exports.perform = async () => {
    const { queues } = config;
    for (const [key, value] of Object.entries(queues)) {
        const params = {
            QueueName: value
        };
        SQS.createQueue(params, (err, data) => {
            if (err) {
                console.error('Error', err);
            } else {
                console.log('Success', data.QueueUrl);
            }
        });
    }
};
