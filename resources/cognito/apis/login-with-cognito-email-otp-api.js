const Route = require('route');
const { respond, logInfo, composeResult, uuid, whenResult } = require('lib');
const db = require('db/repository');
const CreateInitiateAuth = require("resources/cognito/services/create-and-initiate-auth-service");
const InitiateAuth = require("resources/cognito/services/initiate-auth-service");
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');

async function post(req) {
    const { email } = req.body;

    logInfo('Request to login with cognito email otp api ', { email });

    const result = await composeResult(
        async ([user, isNew]) => {
            if (isNew) {
                return CreateInitiateAuth.createInitiateAuth({ email })
            }
            return InitiateAuth.initiateAuth({ email })
        },
        async () => db.executeWithValue(new CreateOrFindUserQuery({
            where: { email: email.toLowerCase() },
            defaults: { id: uuid.v4(), email: email.toLowerCase() }
        })),
    )();

    return respond(result, 'Successfully auth started logging in with phone!', 'Failed to login with phone!');
}

Route.withOutSecurity().noAuth().post('/login-with-cognito-email-otp', post).bind();

module.exports.post = post;