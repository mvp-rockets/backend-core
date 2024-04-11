const AWS = require('aws-sdk');
const config = require('config/config').serviceProviderConfig.awsSQS;

const awsConfig = {
  apiVersion: '2012-11-05',
};
if (config?.accessKeyId) {
  awsConfig.accessKeyId = config.accessKeyId;
  awsConfig.secretAccessKey = config.secretAccessKey;
}
if (config?.region) {
  awsConfig.region = config.region;
}
if (config?.endpoint) {
  awsConfig.endpoint = config.endpoint;
}

const SQS = new AWS.SQS(awsConfig);
module.exports = () => SQS;
