const Socket = require('socket');
const Result = require('folktale/result');
const { logInfo } = require('lib');

async function getServerTime(req) {
    logInfo('get server time socket');

    req.socket.emit('/get/server-time', Date.now());

    return Result.Ok(true);
}

module.exports = (socket) => Socket.withOutSecurity().noAuth().on('/get/server-time', getServerTime).bind(socket);
