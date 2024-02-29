const CreateCognitoUserService = require('resources/cognito/services/create-cognito-user-service.js');
const InitiateAuth = require('resources/cognito/services/initiate-cognito-custom-auth-service.js');
const { logInfo, whenResult, composeResult } = require('lib');
const Result = require('folktale/result');

const initiate = async(email) => {
    return composeResult(
        (initiateAuth) => Result.Ok({ session: initiateAuth.Session }),
        () => InitiateAuth.initiate({ email })
    )();
}

module.exports.createInitiateAuth = async (details) => {
    const { email } = details;
    logInfo('create and initiate auth', { email });

    const authResult = await CreateCognitoUserService.create({ email });

    return whenResult(
        async () => initiate(email),
        async (error) => {
            if (error.code === 'UsernameExistsException') {
                const initiateAuth = await InitiateAuth.initiate({ email });
                return whenResult((auth) => {
                    return Result.Ok({ session: auth.Session })}
                )(initiateAuth)
            }
            return Result.Error(error);
        }
    )(authResult);
}