const winston = require('winston');
require('winston-daily-rotate-file');
const config = require('config/config.js');
const fs = require('fs');
const WinstonCloudWatch = require('winston-cloudwatch');

const logDir = './logs';
let transport;
let logger;
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
if (config.enableAwsLogger) {
    logger = winston.add(new WinstonCloudWatch({
        logGroupName: config.AwsCloudwatch.logGroupName,
        logStreamName: config.AwsCloudwatch.logStreamName,
        awsAccessKeyId: config.AwsCloudwatch.awsAccessKeyId,
        awsSecretKey: config.AwsCloudwatch.awsSecretKey,
        awsRegion: config.AwsCloudwatch.region,
        messageFormatter: ({ level, message, body }) => `[${level}] : ${message} \nBody: ${JSON.stringify(body)}}`
    }));
} else if (!logger) {
    let logFile = './logs/log';
    if (config.env === 'test') {
        logFile = './logs/test-log';
    }
    transport = new (winston.transports.DailyRotateFile)({
        filename: logFile,
        datePattern: 'YYYY-MM-DD',
        prepend: true,
        json: true,
        colorize: true,
        level: 'debug'
    });
    logger = winston.createLogger({
        transports: [
            transport
        ]
    });
}
module.exports = logger;
