const passport = require('passport');
const config = require('config/config');

module.exports = (app) => {
    app.post(
        '/verify-otp-with-email',
        passport.authenticate('cognito', {
            session: false
        }),
        (req, res) => {
            res.send(req.user);
        }
    );

    app.get('/cognito-login-with-google', async (req, res) => {
        loginMethod = 'Google';
        //change this url based on env and also dont forget to configure callback url in cognito
        const redirectUrl = 'http://localhost:3001/auth-cognito/callback'
        const url = `${config.awsCognito.domain}/oauth2/authorize?identity_provider=Google&redirect_uri=${redirectUrl}/auth-cognito/callback&response_type=CODE&client_id=${config.awsCognito.clientId}&scope=email%20openid%20profile`;

        res.redirect(302, url);
    })

};
