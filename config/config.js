const config = require('config');
const R = require('ramda')

const secretVariable = {
    apiPort: process.env.API_PORT,
    env: process.env.ENVIRONMENT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    dialect: process.env.DB_DIALECT,
    seederStorage: process.env.DB_SEEDER_STORAGE,
    serviceProviderConfig: 'serviceProviderConfig',
    logType: process.env.LOG_TYPE,
    clsNameSpace: process.env.CLS_NAMESPACE,
    cronitorSecretKey: process.env.CRONITOR_SECRET_KEY,
    cors: {
        whiteListOrigins: process.env.WHITE_LIST_ORIGINS
            ? process.env.WHITE_LIST_ORIGINS.split(',')
            : [],

    },
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    azure: {
        clientId: process.env.AZURE_AD_CLIENT_ID,
        tenantId: process.env.AZURE_AD_TENANT_ID,
        issuer: process.env.AZURE_AD_ISSUER,
        jwksUri: process.env.AZURE_AD_JWKS_URI,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
    },
    redis: {
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD
    }
};

const variables = R.mergeDeepLeft(secretVariable, config);
module.exports = variables;
