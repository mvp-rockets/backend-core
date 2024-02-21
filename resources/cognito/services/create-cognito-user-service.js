
const CongnitoClient = require('./get-cognito-client.js');
const config = require('config/config');
const { logError } = require('lib');
const Result = require('folktale/result');

module.exports.create = async ({ email }) => {
    return new Promise((resolve) => {
        try { 
            const cognitoClient = CongnitoClient.getCognitoCLient();

            cognitoClient.signUp({
                ClientId: config.awsCognito.clientId,
                Username: email,
                Password: new Date().getTime().toString(),
                UserAttributes: [{ Name: "email", Value: email }],
            }, (err, data) => {
                if (err) {
                    logError('Error occurred while signup using cognito', { email, err })
                    return resolve(Result.Error(err));
                }
                resolve(Result.Ok(data));
            });
        } catch (err) {
            logError('Exceptional Error occurred while signup using cognito', { email, err })
            return resolve(Result.Error(err));
        }
    })
}