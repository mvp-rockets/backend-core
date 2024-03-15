const AWS = require('aws-sdk');
const config = require('config/config').serviceProviderConfig.awsSQS;

AWS.config.update({
    apiVersion: '2012-11-05',
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});

const SQS = new AWS.SQS();
module.exports = () => SQS;
