
const CongnitoClient = require('./get-cognito-client.js');
const config = require('config/config');
const { logError } = require('lib');
const Result = require('folktale/result');

module.exports.verify = async ({ email, session, code }) => {
    return new Promise((resolve) => {
        try {
            const cognitoClient = CongnitoClient.getCognitoCLient();

            cognitoClient.respondToAuthChallenge({
                ChallengeName: 'CUSTOM_CHALLENGE',
                Session: session,
                ChallengeResponses: { USERNAME: email, ANSWER: code },
                ClientId: config.awsCognito.clientId,
            }, (err, data) => {
                if (err) {
                    logError('Error occurred while verifying otp with email using cognito', { email, err })
                    return resolve(Result.Error(err));
                }
                resolve(Result.Ok(data));
            });
        } catch (err) {
            logError('Exceptional Error occurred while verifying otp with email using cognito', { email, err })
            return resolve(Result.Error(err));
        }
    })
}