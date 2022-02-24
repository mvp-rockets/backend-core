require('app-module-path').addPath(__dirname);

const express = require('express');

const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const config = require('config/config');
const bodyParser = require('body-parser');
const ApiError = require('lib/functional/api-error');
const ValidationError = require('lib/validation-error');
const { logError } = require('lib/functional/logger');

const app = express();
const server = require('http').createServer(app);
const Route = require('route');

Route.setApp(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.listen(config.apiPort, async () => {
    try {
        require('./api-routes');

        app.use((req, res, next) => {
            const err = new ApiError(404, 'Not Found', 'Resource Not Found!');
            next(err);
        });

        app.use((error, request, response, next) => {
            if (error.constructor === ApiError) {
                logError('Failed to execute the operation', { error });
                if (error.code) { response.status(error.code); }

                response.send({
                    status: false,
                    errorType: 'api',
                    message: error.errorMessage
                });
            } else if (error.constructor === ValidationError) {
                logError('Failed to execute the operation', error.errorMessage);
                response.send({
                    status: false,
                    errorType: 'validation',
                    message: error.errorMessage
                });
            } else {
                console.error(error);
                response.status(501);
                logError('Failed to execute the operation', error);
                response.send({
                    status: false,
                    errorType: 'unhandled',
                    message: 'Something went wrong!'
                });
            }
        });
    } catch (error) {
        console.log(error);
    }

    console.log(`Express server listening on port ${config.apiPort}`);
});

process.on('unhandledRejection', (error) => {
    console.log(error);
    logError('unhandledRejection', { error });
});

process.on('uncaughtException', (error) => {
    console.log(error);

    logError('uncaughtException', { error });
});
