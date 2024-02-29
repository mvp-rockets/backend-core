const passport = require('passport');
const passportCustom = require('passport-custom');

const CustomStrategy = passportCustom.Strategy;

const VerifyOtpService = require('resources/cognito/services/verify-otp-service');

passport.use(
    'cognito',
    new CustomStrategy(async (req, done) => {
        const response = await VerifyOtpService.verify(req)
        done(null, response.value);
    })
);
