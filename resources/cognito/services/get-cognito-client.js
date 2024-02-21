const AWS = require('aws-sdk');
const config = require('config/config');

AWS.config.update({
    apiVersion: '2016-04-18',
    region: config.awsCognito.region
});

const cognitoIdentityProvider = new AWS.CognitoIdentityServiceProvider();
module.exports = {getCognitoCLient: () => cognitoIdentityProvider};

