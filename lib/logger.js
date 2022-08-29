const winston = require('winston');
require('winston-daily-rotate-file');
const config = require('config/config');
const fs = require('fs');
const WinstonCloudWatch = require('winston-cloudwatch');

const logDir = './logs';
let transport;
let logger;
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
if (config.awsCloudwatch.enableAwsLogger) {
    const AWS = require('aws-sdk');
    AWS.config.update({
        region: config.awsCloudwatch.region,
        accessKeyId: config.awsCloudwatch.accessKeyId,
        secretAccessKey: config.awsCloudwatch.secretKey
    });
    logger = winston.add(new WinstonCloudWatch({
        cloudWatchLogs: new AWS.CloudWatchLogs(),
        logGroupName: config.awsCloudwatch.logGroupName,
        logStreamName: config.awsCloudwatch.logStreamName,
        messageFormatter: ({
            level, message, body, traceId
        }) => `[${level}] : ${`traceId : ${traceId}`} ${message} \nBody: ${JSON.stringify(body)}}`
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
