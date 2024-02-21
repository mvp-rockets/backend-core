const { logInfo, composeResult } = require('lib');
const Result = require('folktale/result');
const VerifyEmailWithOtpCognitoService = require('resources/cognito/services/verify-email-otp-cognito-service');

module.exports.verify = async (req) => {
    const { session, code, email } = req.body;

    logInfo('Request to get verify otp cognito ', { session, code, email });

    return composeResult(
        async (newToken) => {
            if(newToken.Session) {
                return Result.Error({message: 'Incorrect OTP. Please enter the correct OTP', session: newToken.Session});
            }
       
            const authTokens = {
                id_token: newToken?.AuthenticationResult?.IdToken,
                access_token: newToken?.AuthenticationResult?.AccessToken,
                refresh_token: newToken?.AuthenticationResult?.RefreshToken,
            };
            return Result.Ok(authTokens)
        },
        () => VerifyEmailWithOtpCognitoService.verify({ email, session, code })
    )();
}

