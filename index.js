require('app-module-path').addPath(__dirname);

const express = require('express');

const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: `./env/.env.${process.env.APP_ENV}` });
const { Logger } = require('@mvp-rockets/namma-lib');
const config = require('config/config');

require('utils/socket');
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

const { token } = require('@mvp-rockets/namma-lib');

token.initialize(config.jwtSecretKey);

const { ApiError } = require('lib');
const { logError, logInfo } = require('lib');
const { HTTP_CONSTANT } = require('@mvp-rockets/namma-lib');

if (config.newrelic?.licenseKey) {
  console.log('New Relic is enabled');
  require('newrelic');
}

const app = express();
const server = require('http').createServer(app);
const Route = require('route');
const uuid = require('uuid');
const helmet = require('helmet');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = config.cors.whiteListOrigins;
const allowedOriginsRegularExpression = allowedOrigins.map((origin) => new RegExp(`${origin}$`));
app.use(cors({ origin: allowedOriginsRegularExpression }));

app.use((req, res, next) => {
    const platform = req.headers['x-platform'] || 'unknown-platform';
    namespace.run(() => {
        namespace.set('traceId', uuid.v4());
        logInfo(`${req.method} ${req.originalUrl}`, {
            ...req.query, ...req.body, platform
        });
        next();
    });
});

Route.setApp(app);

app.use(helmet());
app.disable('x-powered-by');

require('./api-routes');
require('./passport')(app);

app.use((req, res, next) => {
    const err = new ApiError('Not Found', 'Resource Not Found!', HTTP_CONSTANT.NOT_FOUND);
    next(err);
});

app.use((error, request, response, next) => {
    const platform = request.headers['x-platform'] || 'unknown-platform';
    if (error.constructor === ApiError) {
        logError('Failed to execute the operation', {
            value: error.error,
            stack: error.error ? error.error.stack : [],
            platform
        });
        if (error.code) { response.status(error.code); }
        response.send({
            status: false,
            error: error?.error,
            message: error?.errorMessage
        });
    } else {
        response.status(HTTP_CONSTANT.NOT_IMPLEMENTED);
        logError('Failed to execute the operation', { value: error, stack: error.stack, platform });
        response.send({
            status: false,
            errorType: 'unhandled',
            message: 'Something went wrong!'
        });
    }
});

process.on('unhandledRejection', (error) => {
    console.error("UnhandledRejection: ", error);
    logError('unhandledRejection', { error });
    //shutdown('EXCEPTION', error);
});

process.on('uncaughtException', (error) => {
    console.error("UnCaughtException: ", error);
    logError('uncaughtException', { error });
    //shutdown('EXCEPTION', error);
});

function shutdown( signal, error ) {
	console.info( `[${signal}] shutting down...` );
   
    // FIXME: Handle error state gracefully. Check if db and redis are still alive before closing them
    server.close(() => {
        logInfo('HTTP server closed');
        process.exit(0);
        //db.stop(function(err) {
        //    process.exit(err || error ? 1 : 0)
        //})    
    });
}

process.on( 'SIGINT', () => shutdown( 'SIGINT' ) )
process.on( 'SIGTERM', () => shutdown( 'SIGTERM' ) )

// In case we are running under docker
process.send = process.send || function () {};

server.listen(config.apiPort, () => {
    console.log(`Express server listening on Port :- ${config.apiPort}`);
    // Here we send the ready signal to PM2
    process.send('ready');
});
