const SQS = require('sqs/get-sqs-client')();
const config = require('config/config').serviceProviderConfig.awsSQS;

module.exports.perform = async () => {
    const { queues, arn, deadLetterQueue, url } = config;
    const deadLetterQueueArn = `${arn}:${deadLetterQueue}`;
    for (const [key, value] of Object.entries(queues)) {
        const params = {
            Attributes: {
                RedrivePolicy: `{\"deadLetterTargetArn\":\"${deadLetterQueueArn}\",\"maxReceiveCount\":\"5\"}`
            },
            QueueUrl: `${url}/${value}`
        };
        SQS.setQueueAttributes(params, (err, data) => {
            if (err) {
                console.error('Error', err);
            } else {
                console.log('Success', data.ResponseMetadata);
            }
        });
    }
};
