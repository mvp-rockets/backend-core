require('app-module-path').addPath(__dirname);

const express = require('express');

const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const cls = require('cls-hooked');
const config = require('config/config');
const bodyParser = require('body-parser');
const ApiError = require('lib/functional/api-error');
const ValidationError = require('lib/validation-error');
const { logError, logInfo } = require('lib/functional/logger');

const app = express();
const server = require('http').createServer(app);
const Route = require('route');
const uuid = require('uuid');

Route.setApp(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    const namespace = cls.getNamespace(config.clsNameSpace);
    const platform = req.headers['x-platform'] || 'unknown-platform';
    namespace.run(() => {
        namespace.set('traceId', uuid.v4());
        logInfo(`${req.method} ${req.originalUrl}`, { ...req.body, platform });
        next();
    });
});

require('./api-routes');

app.use((req, res, next) => {
    const err = new ApiError(404, 'Not Found', 'Resource Not Found!');
    next(err);
});

app.use((error, request, response, next) => {
    const platform = request.headers['x-platform'] || 'unknown-platform';

    if (error.constructor === ApiError) {
        logError('Failed to execute the operation', {
            error: {
                value: error.error, stack: error.error ? error.error.stack : []
            }, platform
        });
        if (error.code) { response.status(error.code); }

        response.send({
            status: false,
            errorType: 'api',
            message: error.errorMessage
        });
    } else if (error.constructor === ValidationError) {
        logInfo('Failed to execute the operation', { error: error.errorMessage, platform });
        response.send({
            status: false,
            errorType: 'validation',
            message: error.errorMessage
        });
    } else {
        console.error(error);
        response.status(501);
        logError('Failed to execute the operation', { value: error, stack: error.stack, platform });
        response.send({
            status: false,
            errorType: 'unhandled',
            message: 'Something went wrong!'
        });
    }
});

process.on('unhandledRejection', (error) => {
    console.log(error);
    logError('unhandledRejection', { error });
});

process.on('uncaughtException', (error) => {
    console.log(error);
    logError('uncaughtException', { error });
});

server.listen(config.port, () => {
    console.log(`Express server listening on port ${config.port}`);
});