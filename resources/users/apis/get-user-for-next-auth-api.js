const Route = require('route');
const { respond, logInfo, ApiError, uuid } = require('lib');
const db = require('db/repository.js');
const composeResult = require('@mvp-rockets/namma-lib/src/lib/utilities/compose-result');
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');
const R = require('ramda');
const Result = require('folktale/result');
const config = require('config/config');

async function post(req) {
    const { email, nextAuthSecretPass } = req.query;

    logInfo('Request to get user for next auth api ', { email });

    const response = await composeResult(
        async ([user]) =>  Result.Ok(user),
        () => db.executeWithValue(new CreateOrFindUserQuery({
            where: { email: email.toLowerCase() }
        })),
        async () => R.ifElse(
            () => nextAuthSecretPass == config.nextAuthSecretPass,
            () => Result.Ok([]),
            () => Result.Error(new ApiError('api error', 'Not Authorized', 400))
        )(),
    )();

    return respond(response, 'Successfully got user for next auth!', 'Failed to get user for next auth!');
}

Route.withOutSecurity().noAuth().get('/user-next-auth', post).bind();

module.exports.post = post;
