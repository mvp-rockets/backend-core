const Route = require('route');
const db = require('db/repository')
const R = require('ramda');
const bcrypt = require('bcryptjs');
const Result = require('folktale/result');
const { composeResult, token: TokenService, respond, ApiError } = require('lib');

const GetOneUserByConditionQuery = require('resources/users/queries/get-one-user-by-condition-query');


async function login(req) {
    const { email, otp } = req.body;

    const response = await composeResult(
        (token) => Result.Ok({ token }),
        async (user) => composeResult(
            (isValid) => R.ifElse(
                () => isValid,
                () => TokenService.generate({ id: user.id, email: user.email }),
                () => Result.Error(new ApiError('api error', 'Invalid OTP', 400))
            )(),
            async () => Result.Ok(await bcrypt.compare(otp, user.mlVerificationToken))
        )(),
        () => db.executeWithValue(new GetOneUserByConditionQuery({ email: email.toLowerCase() })),
    )();

    return respond(response, "Verified otp successfully!", "failed to verify otp!");
}

Route.withOutSecurity().noAuth().post('/verify-login-otp', login).bind();

module.exports = login;
