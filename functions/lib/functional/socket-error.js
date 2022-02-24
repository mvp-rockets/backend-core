module.exports = class SocketError {
    constructor(error, errorMessage) {
        this.error = new Error(error);
        this.error.data = { content: errorMessage }
    }
};
