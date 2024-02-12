const Models = require('models');

module.exports = class CreateUserQuery {
    constructor(details) {
        this.id= details.id;
        this.username = details.username;
        this.password = details.password;
    }

    get() {
        return Models.User.create({ id:this.id, username: this.username, password: this.password });
    }
};
