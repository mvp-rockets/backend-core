
const CongnitoClient = require('./get-cognito-client.js');
const config = require('config/config');
const { logError, whenResult } = require('lib');
const Result = require('folktale/result');
const CreateCognitoUserService = require('resources/cognito/services/create-cognito-user-service.js');

module.exports.initiate = async ({ email }) => {
    return new Promise((resolve) => {
        try {
            const cognitoClient = CongnitoClient.getCognitoCLient();

            cognitoClient.initiateAuth({
                AuthFlow: 'CUSTOM_AUTH',
                AuthParameters: {
                    USERNAME: email
                },
                ClientId: config.awsCognito.clientId
            }, async (err, data) => {
                if (err) {
                    logError('Error occurred while initiating auth using cognito', { err });
                    if (err.code === 'NotAuthorizedException' && err.message === 'Incorrect username or password.') {
                        const cognitoUserResult = await CreateCognitoUserService.create({ email });
                        whenResult(
                            async () => resolve(Result.Error({ code: 'userWasNotRegisteredException'})),
                            (cognitoError) => resolve(Result.Error(cognitoError))
                        )(cognitoUserResult);
                    }
                    return resolve(Result.Error(err));
                }

                resolve(Result.Ok(data));
            });
        } catch (err) {
            logError('Exceptional Error occurred while initiating auth using cognito', { err })
            return resolve(Result.Error(err));
        }
    })
}