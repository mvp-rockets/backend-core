const CreateCognitoUserService = require('resources/cognito/services/create-cognito-user-service.js');
const InitiateAuth = require('resources/cognito/services/initiate-cognito-custom-auth-service.js');
const { logInfo, whenResult, composeResult } = require('lib');
const Result = require('folktale/result');

const initiate = async(user, isNew, email) => {
    return composeResult(
        (initiateAuth) => Result.Ok({ user, isNew, session: initiateAuth.Session }),
        () => InitiateAuth.initiate({ email })
    )();
}

module.exports.createInitiateAuth = async (details) => {
    const { email, user, isNew } = details;
    logInfo('create and initiate auth', { email, user, isNew });

    const authResult = await CreateCognitoUserService.create({ email });

    return whenResult(
        async () => initiate(user, isNew, email),
        async (error) => {
            if (error.code === 'UsernameExistsException') {
                const initiateAuth = await InitiateAuth.initiate({ email });
                return whenResult((auth) => {
                    return Result.Ok({ user, isNew, session: auth.Session })}
                )(initiateAuth)
            }
            return Result.Error(error);
        }
    )(authResult);
}