const AWS = require('aws-sdk');
const config = require('config/config');

const awsConfig = {
  region: config.awsCognito.region,
  apiVersion: '2016-04-18'
};

const cognitoIdentityProvider = new AWS.CognitoIdentityServiceProvider(awsConfig);
module.exports = {getCognitoCLient: () => cognitoIdentityProvider};

