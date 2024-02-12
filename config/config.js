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

    appVersions: {
        minAndroidVersionName: process.env.APP_MIN_ANDROID_VERSION,
        minIosVersionName: process.env.APP_MIN_IOS_VERSION,
        latestVersionOfAndroid: process.env.ANDROID_LATEST_VERSION,
        latestVersionOfIos: process.env.IOS_LATEST_VERSION,
        featuresUpdate: {
            home: {
                version: '2.2.10',
                path: '/home',
            },
            login: {
                version: '2.3.3',
                path: '/login',
            },
            musicContent: {
                version: '1.9.2',
                path: '/music',
            },
            videoContent: {
                version: '2.2.4',
                path: '/video',
            },
        },
    },
    
    
};

const variables = R.mergeDeepLeft(secretVariable, config);
module.exports = variables;
