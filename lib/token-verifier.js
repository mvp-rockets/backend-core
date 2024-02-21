const { token } = require('@mvp-rockets/namma-lib');
const Result = require('folktale/result');
const R = require('ramda');
const AzureTokenVerifier = require('lib/azure-ad-token-verifier');
const GoogleTokenVerifier = require('lib/google-token-verifier');
const CognitoTokenVerifier = require('lib/cognito-token-verifier');

module.exports.verify = async ({ clientToken, type = 'default' }) => {

    const verify = R.cond([
        [R.propEq('default', 'type'), async () => token.decode(clientToken)],
        [R.propEq('azure', 'type'), async () => AzureTokenVerifier.verifyToken({ clientToken })],
        [R.propEq('google', 'type'), async () => GoogleTokenVerifier.verifyToken({ clientToken })],
        [R.propEq('cognito', 'type'), async () => CognitoTokenVerifier.verifyToken({ clientToken })],
        [R.T, () => Result.Error(`Invalid decoder type`)]
    ]);

    return verify({ clientToken, type });
};