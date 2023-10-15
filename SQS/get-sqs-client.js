const AWS = require('aws-sdk');
const config = require('config/config');

AWS.config.update({
    apiVersion: '2012-11-05',
    region: config.serviceProviderConfig.awsSQS.region,
    accessKeyId: config.serviceProviderConfig.awsSQS.accessKeyId,
    secretAccessKey: config.serviceProviderConfig.awsSQS.secretAccessKey
});

const SQS = new AWS.SQS();
module.exports = () => SQS;
