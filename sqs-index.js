require('app-module-path').addPath(__dirname);

const dotenv = require('dotenv');

dotenv.config({ path: `./env/.env.${process.env.APP_ENV}` });
const { token, Logger } = require('@mvp-rockets/namma-lib');
const config = require('config/config');

const cls = require('cls-hooked');
const namespace = cls.createNamespace(config.clsNameSpace);

const loggerParams = {
    environment: config.env,
    type: config.logType,
    clsNameSpace: config.clsNameSpace
};

if (config.logType === 'aws') {
    loggerParams.isEnable = config.serviceProviderConfig.awsCloudwatch.enableAwsLogger;
    loggerParams.configurations = {
        region: config.serviceProviderConfig.awsCloudwatch.region,
        accessKeyId: config.serviceProviderConfig.awsCloudwatch.accessKeyId,
        secretKey: config.serviceProviderConfig.awsCloudwatch.secretKey,
        logGroupName: config.serviceProviderConfig.awsCloudwatch.logGroupName,
        logStreamName: config.serviceProviderConfig.awsCloudwatch.logStreamName
    };
} else if (config.logType === 'gcp') {
    loggerParams.type = 'google';
    loggerParams.isEnable = config.serviceProviderConfig.gcp.enableGcpLogger;
    loggerParams.configurations = {
        project: config.serviceProviderConfig.gcp.projectName,
        keyFile: config.serviceProviderConfig.gcp.keyFile,
        logStreamName: config.serviceProviderConfig.gcp.logStreamName
    };
}

Logger.initialize(loggerParams);

token.initialize(config.jwtSecretKey);

const { logError } = require('lib');

process.on('unhandledRejection', (error) => {
    console.log('unhandledRejection', { error });
    logError('SQS index unhandledRejection', { error });
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.log('uncaughtException', { error });
    logError('SQS index uncaughtException', { error });
    process.exit(1);
});

function handleHealthZ() {
    console.log("SIGUSR1")
}

process.on("SIGUSR1", () => handleHealthZ);

process.send = process.send || function () {};
// Here we send the ready signal to PM2
process.send('ready');

// require your listeners here
