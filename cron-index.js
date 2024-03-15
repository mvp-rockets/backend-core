require('app-module-path').addPath(__dirname);

const dotenv = require('dotenv');

dotenv.config({ path: `./env/.env.${process.env.NODE_ENV}` });
const { token, Logger } = require('@mvp-rockets/namma-lib');
const config = require('config/config');

Logger.initialize({
    isEnable: config.awsCloudwatch.enableAwsLogger,
    type: 'aws',
    environment: config.env,
    clsNameSpace: config.clsNameSpace,
    configurations: {
        region: config.awsCloudwatch.region,
        accessKeyId: config.awsCloudwatch.accessKeyId,
        secretKey: config.awsCloudwatch.secretKey,
        logGroupName: config.awsCloudwatch.logGroupName,
        logStreamName: config.awsCloudwatch.logStreamName
    }
});
token.initialize(config.jwtSecretKey);
const { logError } = require('lib');

require('crons/heartbeat')
require('crons/jobs/test-cron')

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
