const InitiateAuth = require('resources/cognito/services/initiate-cognito-custom-auth-service.js');
const { whenResult } = require('lib');
const Result = require('folktale/result');

module.exports.initiateAuth = async (details) => {
    const { email } = details;

    const authResult = await InitiateAuth.initiate({ email });

    return whenResult(
        (authSession) => Result.Ok({ session: authSession.Session }),
        (error) => Result.Error(error)
    )(authResult);
}