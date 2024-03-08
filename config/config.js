const config = require('config');
const R = require('ramda');

const secretVariable = {
    apiPort: process.env.API_PORT,
    socketPort: process.env.SOCKET_PORT,
    env: process.env.ENVIRONMENT,
    db: {
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      dialect: 'postgres',
      seederStorage: 'sequelize',
      pool: {
        max: 100,
        min: 0,
        idle: 10000,
        evict: 10000
      },
    },
    serviceProviderConfig: 'serviceProviderConfig',
    logType: process.env.LOG_TYPE,
    clsNameSpace: process.env.CLS_NAMESPACE,
    cronitorSecretKey: process.env.CRONITOR_SECRET_KEY,
    cors: {
        whiteListOrigins: process.env.WHITE_LIST_ORIGINS
            ? process.env.WHITE_LIST_ORIGINS.split(',')
            : []

    },
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    azure: {
        clientId: process.env.AZURE_AD_CLIENT_ID,
        tenantId: process.env.AZURE_AD_TENANT_ID,
        issuer: process.env.AZURE_AD_ISSUER,
        jwksUri: process.env.AZURE_AD_JWKS_URI
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        expiryTime: 1500
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
        emailFrom: process.env.SMTP_EMAIL_FROM
    },
    awsCognito: {
        region: process.env.AWS_COGNITO_REGION,
        clientId: process.env.AWS_COGNITO_CLIENT_ID,
        userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        domain: process.env.AWS_COGNITO_DOMAIN
    },
    nextAuthSecretPass: 'some_secret',
    appVersions: {
        minAndroidVersionName: process.env.APP_MIN_ANDROID_VERSION,
        minIosVersionName: process.env.APP_MIN_IOS_VERSION,
        latestVersionOfAndroid: process.env.ANDROID_LATEST_VERSION,
        latestVersionOfIos: process.env.IOS_LATEST_VERSION,
        featuresUpdate: {
            home: {
                version: '2.2.10',
                path: '/home'
            },
            login: {
                version: '2.3.3',
                path: '/login'
            },
            musicContent: {
                version: '1.9.2',
                path: '/music'
            },
            videoContent: {
                version: '2.2.4',
                path: '/video'
            }
        }
    }
};

const variables = R.mergeDeepLeft(secretVariable, config);
module.exports = variables;
