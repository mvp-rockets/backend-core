const { App } = require('uWebSockets.js');
const { Server } = require('socket.io');
const config = require('config/config');
const Socket = require('socket');

const app = new App();
const io = new Server({
    cors: {
        origin: config.cors.whiteListOrigins.map((origin) => new RegExp(`${origin}$`))
    }
});

io.attachApp(app);

io.of('/events/').on('connection', async (socket) => {
    Socket.setIo(socket, io.of('/events/'));
});
app.listen(Number(config.socketPort), (token) => {
    console.log(`Socket server listening on ${config.socketPort}`);

    if (!token) {
        console.warn('port already in use');
    }
});
module.exports.io = io.of('/events/');
