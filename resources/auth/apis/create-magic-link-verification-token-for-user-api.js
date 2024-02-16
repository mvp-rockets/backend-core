const Route = require('route');
const { respond, logInfo, ApiError, uuid } = require('lib');
const db = require('db/repository.js');
const composeResult = require('@mvp-rockets/namma-lib/src/lib/utilities/compose-result');
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');
const R = require('ramda');
const Result = require('folktale/result');
const config = require('config/config');

async function post(req) {
    const { email, nextAuthSecretPass, mlVerificationToken, mlVerificationTokenExp } = req.body;

    logInfo('Request to create magic link verification token for user api ', { email, nextAuthSecretPass, mlVerificationToken, mlVerificationTokenExp });

    const response = await composeResult(
        () => Result.Ok('ok'),
        async ([user, isNew]) => R.ifElse(
            () => isNew,
            () => Result.Ok([]),
            () => db.perform(user.update({ mlVerificationToken, mlVerificationTokenExp }))
        )(),
        () => db.executeWithValue(new CreateOrFindUserQuery({
            where: { email: email.toLowerCase() },
            defaults: { id: uuid.v4(), email: email.toLowerCase(), mlVerificationToken, mlVerificationTokenExp }
        })),
        async () => R.ifElse(
            () => nextAuthSecretPass == config.nextAuthSecretPass,
            () => Result.Ok([]),
            () => Result.Error(new ApiError('api error', 'Not Authorized', 400))
        )(),
    )();

    return respond(response, 'Successfully created magic link verification token for user!', 'Failed to create magic link verification token for user!');
}

Route.withOutSecurity().noAuth().post('/ml-verification-token', post).bind();

module.exports.post = post;
