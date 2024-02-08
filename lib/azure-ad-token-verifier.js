const config = require('config/config');
const Result = require('folktale/result');

module.exports.verifyToken = async ({ clientToken, cacheLifetimeInHour = 12 }) => {
    const { verify: azureVerifier } = await import('azure-ad-verify-token');
    const { setConfig } = await import('azure-ad-verify-token');

    setConfig({
        cacheLifetime: cacheLifetimeInHour * (60 * 60 * 1000),
    });

    const options = {
        jwksUri: config.azure.jwksUri,
        issuer: config.azure.issuer,
        audience: config.azure.clientId
    }

    try {
        const decoded = await azureVerifier(clientToken, options);

        return Result.Ok(decoded);
    } catch (err) {
        return Result.Error(err);
    }
}