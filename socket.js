/* eslint max-classes-per-file: ["error", 4] */
/* eslint-disable block-scoped-var */
/* eslint-disable no-var */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-new */
/* eslint-disable max-classes-per-file */
const async = require('async');

const { ApiError, logError, whenResult } = require('lib');
const { defaultTransaction = false } = require('config/config');
const TokenVerifier = require('lib/token-verifier');
const AutoImportSockets = require('./utils/autoimport-socket');
const { sequelize } = require('./models');

class Socket {
    constructor() {
        this.handlers = {};
        this.io = {};
    }

    setIo(socket, io) {
        this.io = io;
        new AutoImportSockets({ includes: ['sockets'], toload: ['-socket.js'] }, socket);
    }

    getIo() {
        return this.io;
    }

    withSecurity() {
        return new PreRequestHandler(new RestHandler(this), security);
    }

    withOutSecurity() {
        return new PreRequestHandler(new RestHandler(this), (data, callback) => {
            callback(true);
        });
    }

    getHandler(url, method) {
        if (!this.handlers[url]) {
            return {
                status: false,
                message: `${url} not registered `
            };
        }
        if (!this.handlers[url][method]) {
            return {
                status: false,
                message: `${url} not registered for ${method}`
            };
        }
        return {
            status: true,
            handler: this.handlers[url][method]
        };
    }

    addToCache(url, restHandler) {
        const existingHandler = this.handlers[url];
        let exists = false;
        if (existingHandler) {
            const handlerForGivenMethod = existingHandler[restHandler.method];
            if (handlerForGivenMethod) {
                existingHandler[restHandler.method] = [restHandler];
                exists = true;
            } else {
                existingHandler[restHandler.method] = [restHandler];
            }
        } else {
            this.handlers[url] = {};
            this.handlers[url][restHandler.method] = [restHandler];
        }
        return {
            alreadyExist: exists
        };
    }

    bind(restHandler, socket) {
        this.addToCache(restHandler.url, restHandler);
        const self = this;
        const result = self.getHandler(restHandler.url, restHandler.method);
        const handlersForUrl = result.handler;
        var restHandler = handlersForUrl[0];
        this.bindToRouter(
            restHandler.url,
            (data) => {
                restHandler.preRequestHandler.securityCheck(data, (decoded) => {
                    if (decoded) self.execute(restHandler.transaction, restHandler.url, restHandler.method, { data, decoded }, socket);
                    else {
                        socket?.emit(restHandler.url, { error: new ApiError('unauthorized', 'Access denied', 401) });
                    }
                });
            },

            socket
        );
    }

    bindToRouter(url, func, socket) {
        socket.on(url, func);
    }

    execute(transaction, url, method, { data, decoded }, socket, next = () => { }) {
        const self = this;
        const result = self.getHandler(url, method);
        if (!result.status) {
            next(result.message);
        } else {
            const handlersForUrl = result.handler;
            async.detect(handlersForUrl, (handler, callback) => {
                handler.preRequestHandler.filterFunction({ decoded }, data, callback);
            }, async (err, selectedHandler) => {
                if (err) {
                    socket?.emit(url, { error: err });
                    next(err); return;
                }
                const { functionToBeCalled } = selectedHandler;
                if (transaction) {
                    try {
                        await sequelize
                            .transaction(async (t1) => {
                                const result1 = await functionToBeCalled({
                                    data, socket, io: this.io, decoded
                                });
                                result1.matchWith({
                                    Ok: ({
                                        value
                                    }) => {
                                        next(null, value);
                                    },
                                    Error: ({
                                        value
                                    }) => {
                                        throw value;
                                    }
                                });
                                const appliedFn = async.applyEach(selectedHandler.postRequestHandler.nextSteps, result1);
                                appliedFn((error) => {
                                    if (error) {
                                        logError('Failed in socket', error);
                                    }
                                });
                            });
                    } catch (error) {
                        console.error(error);
                        next(error);
                    }
                } else {
                    try {
                        const result1 = await functionToBeCalled({
                            data, socket, io: this.io, decoded
                        });
                        result1.matchWith({
                            Ok: ({ value }) => {
                                next(null, value);
                            },
                            Error: ({ value }) => {
                                next(value);
                            }
                        });
                        const appliedFn = async.applyEach(selectedHandler.postRequestHandler.nextSteps, result1);
                        appliedFn((error) => {
                            if (error) {
                                logError('Failed in socket', error);
                            }
                        });
                    } catch (error) {
                        console.error(error);
                        next(error);
                    }
                }
            });
        }
    }
}

class RestHandler {
    constructor(peopplRoute) {
        this.peopplRoute = peopplRoute;
    }

    setPreRequestHandler(preRequestHandler) {
        this.preRequestHandler = preRequestHandler;
    }

    on(url, functionToBeCalled) {
        this.url = url;
        this.functionToBeCalled = functionToBeCalled;
        this.method = 'On';
        this.postRequestHandler = new PostRequestHandler(this);
        return this.postRequestHandler;
    }

    bind(transaction, socket) {
        this.transaction = transaction;
        this.peopplRoute.bind(this, socket);
    }
}

class PreRequestHandler {
    constructor(restHandler, securityCheck) {
        this.securityCheck = securityCheck;
        this.restHandler = restHandler;
    }

    authorize(filterFunction) {
        this.filterFunction = filterFunction;
        this.restHandler.setPreRequestHandler(this);
        return this.restHandler;
    }

    noAuth() {
        this.filterFunction = (req, res, callback) => {
            callback(null, true);
        };
        this.restHandler.setPreRequestHandler(this);
        return this.restHandler;
    }
}

class PostRequestHandler {
    constructor(restHandler) {
        this.restHandler = restHandler;
        this.nextSteps = [];
    }

    then(nextStep) {
        this.nextSteps.push(nextStep);
        return this;
    }

    bind(socket) {
        this.restHandler.bind(defaultTransaction, socket);
    }

    bindWithTransaction(socket) {
        this.restHandler.bind(true, socket);
    }

    bindWithOutTransaction(socket) {
        this.restHandler.bind(false, socket);
    }
}

async function security(data, next) {
    const clientToken = data.token;
    if (clientToken) {
        const response = await TokenVerifier.verify({ clientToken });

        whenResult(
            (decoded) => {
                next(decoded);
            },
            (error) => {
                logError('token verification failed', error);
                next(false);
            }
        )(response);
    } else {
        logError('No Token provided', +data);
        next(false);
    }
}
module.exports = new Socket();
