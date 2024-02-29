const Route = require('route');
const { respond, logInfo, ApiError, whenResult, token: TokenService } = require('lib');
const db = require('db/repository.js');
const composeResult = require('@mvp-rockets/namma-lib/src/lib/utilities/compose-result');
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');
const R = require('ramda');
const Result = require('folktale/result');
const config = require('config/config');

async function post(req) {
    const { email, nextAuthSecretPass, mlVerificationToken } = req.body;

    logInfo('Request to verify magic link verification token for user api ', { email, nextAuthSecretPass, mlVerificationToken });

    let responseData = {};

    const response = await composeResult(
        () => Result.Ok(responseData),
        async ([user]) => R.ifElse(
            () => mlVerificationToken == user.mlVerificationToken && new Date() < new Date(user.mlVerificationTokenExp),
            async () => {
                responseData = {
                    email: user.email,
                    mlVerificationToken: user.mlVerificationToken,
                    mlVerificationTokenExp: user.mlVerificationTokenExp
                }
                const tokenRes = await TokenService.generate({ id: user.id, email });

                return whenResult(
                    (jwtToken) => db.perform(user.update({
                        // Just for reusability and limitation we have, we are updating generated jwt token in verificationToken field to send back to client.
                        mlVerificationToken: jwtToken, mlVerificationTokenExp: null
                    }))
                )(tokenRes);
            },
            () => Result.Error(new ApiError('api error', 'Token is invalid or expired', 400))
        )(),
        () => db.executeWithValue(new CreateOrFindUserQuery({
            where: { email }
        })),
        async () => R.ifElse(
            () => nextAuthSecretPass == config.nextAuthSecretPass,
            () => Result.Ok([]),
            () => Result.Error(new ApiError('api error', 'Not Authorized', 400))
        )(),
    )();

    return respond(response, 'Successfully verified magic link verification token for user!', 'Failed to verify magic link verification token for user!');
}

Route.withOutSecurity().noAuth().post('/verify-ml-verification-token', post).bind();

module.exports.post = post;
