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
    cloudServiceProviderConfig,
    logType: process.env.LOG_TYPE,
    clsNameSpace: process.env.CLS_NAMESPACE,
    cronitorSecretKey: process.env.CRONITOR_SECRET_KEY,
    cors: {
        whiteListOrigins: process.env.WHITE_LIST_ORIGINS
            ? process.env.WHITE_LIST_ORIGINS.split(',')
            : [],

    },
    jwtSecretKey: process.env.JWT_SECRET_KEY
};

const variables = R.mergeDeepLeft(secretVariable, config);
module.exports = variables;
