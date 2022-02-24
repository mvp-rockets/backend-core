const AWS = require('aws-sdk');
const config = require('config/config.js');

AWS.config.update({
    apiVersion: '2012-11-05',
    region: config.SQS.region,
    accessKeyId: config.SQS.accessKeyId,
    secretAccessKey: config.SQS.secretAccessKey
});

const SQS = new AWS.SQS();
module.exports = () => SQS;
