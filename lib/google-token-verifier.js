const Result = require('folktale/result');
const config = require('config/config');
const verifier = require('google-id-token-verifier');

module.exports.verifyToken = async ({ clientToken }) => new Promise((resolve) => {
    verifier.verify(clientToken, config.google.clientId, function (err, tokenInfo) {
        if (!err) {
            resolve(Result.Ok(tokenInfo));
        } else {
            resolve(Result.Error(err));
        }
    })
})
