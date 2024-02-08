const Models = require('models');

module.exports = class CreateUserQuery {
    constructor(details) {
        this.username = details.username;
        this.password = details.password;
    }

    get() {
        return Models.User.create({  username: this.username, password: this.password });
    }
};
