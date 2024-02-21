const Route = require('route');
const { respond, logInfo, composeResult } = require('lib');
const Result = require('folktale/result');
const GenerateNewTokenService = require('resources/cognito/services/get-new-token-service');

async function post(req) {
    const { refreshToken } = req.body;

    logInfo('Request to get new access tokens api ', { refreshToken });

    const result = await composeResult(
        async (newToken) => {
            const authTokens = {
                id_token: newToken.id_token,
                access_token: newToken.access_token
            };
            return Result.Ok(authTokens)
        },
        () => GenerateNewTokenService.generate({ refreshToken }),
    )();

    return respond(result, 'Successfully get new access tokens!', 'Failed to get new access tokens!');
}

Route.withOutSecurity().noAuth().post('/refresh-tokens', post).bind();
module.exports.post = post;
