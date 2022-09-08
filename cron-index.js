require('app-module-path').addPath(__dirname);

const dotenv = require('dotenv');

dotenv.config({ path: `./env/.env.${process.env.NODE_ENV}` });
const { logError } = require('lib')

require('crons/heartbeat')
require('crons/jobs/test-cron')

process.on('unhandledRejection', (error) => {
    console.log('unhandledRejection');
    logError('SQS index unhandledRejection', { error });
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.log('uncaughtException');
    logError('SQS index uncaughtException', { error });
    process.exit(1);
});
