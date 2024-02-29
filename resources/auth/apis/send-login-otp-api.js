const Route = require('route');
const { respond, logInfo, ApiError, uuid, OtpService } = require('lib');
const db = require('db/repository.js');
const composeResult = require('@mvp-rockets/namma-lib/src/lib/utilities/compose-result');
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');
const R = require('ramda');
const Result = require('folktale/result');
const bcrypt = require('bcryptjs');

async function post(req) {
    const { email, } = req.body;

    logInfo('Request to send login otp api ', { email });

    let hashedOTP;
    const response = await composeResult(
        () => Result.Ok('ok'),
        async ([user, isNew]) => R.ifElse(
            () => isNew,
            () => Result.Ok([]),
            () => db.perform(user.update({ mlVerificationToken: hashedOTP }))
        )(),
        async () => {
            const otp = await OtpService.generate();
            hashedOTP = bcrypt.hashSync(otp.toString(), 8);

            return db.executeWithValue(new CreateOrFindUserQuery({
                where: { email: email.toLowerCase() },
                defaults: { id: uuid.v4(), email: email.toLowerCase(), mlVerificationToken: hashedOTP }
            }))
        },
    )();

    return respond(response, 'Successfully sent login otp!', 'Failed to send login otp!');
}

Route.withOutSecurity().noAuth().post('/login-otp', post).bind();

module.exports.post = post;
