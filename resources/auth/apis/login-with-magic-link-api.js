const Route = require('route');
const { logInfo, respond, composeResult } = require('lib');
const SendMagicLinkService = require('resources/auth/services/send-magic-link-via-email-service');
const LoginMagicLinkValidation = require('resources/auth/validators/login-with-magic-link-validation');

const post = async (req) => {
    const { to, theme, url } = req.body;
    logInfo('Request to create and send magic link', { to, theme, url });

    const response = await composeResult(
        () => SendMagicLinkService.send({ to, theme, url }),
        () => LoginMagicLinkValidation.validate({ to, theme, url })
    )({ to, theme, url });

    return respond(response, 'Successfully created and sent magic link!', 'Failed to create and send magic link!');
};

Route.withOutSecurity().noAuth().post('/magic-link', post).bind();

module.exports.post = post;
