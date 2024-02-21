const Result = require('folktale/result');
const config = require('config/config');
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const { SimpleJwksCache } = require('aws-jwt-verify/jwk');
const { SimpleJsonFetcher } = require('aws-jwt-verify/https');

module.exports.verifyToken = async ({ clientToken }) => new Promise((resolve) => {
    const verifier = CognitoJwtVerifier.create(
        {
            userPoolId: config.awsCognito.userPoolId,
            tokenUse: null,
            clientId: config.awsCognito.clientId
        },
        {
            jwksCache: new SimpleJwksCache({
                fetcher: new SimpleJsonFetcher({
                    defaultRequestOptions: {
                        responseTimeout: 30000
                    }
                })
            })
        }
    );

    verifier.verify(clientToken).then((tokenInfo) => {
        resolve(Result.Ok(tokenInfo));
    }).catch((err) => {
        resolve(Result.Error(err));
    })
})
