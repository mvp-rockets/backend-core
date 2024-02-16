const Models = require('models');

module.exports = class CreateOrFindUserQuery {
    constructor({ where, defaults = {} }) {
        this.where = where;
        this.defaults = defaults;
    }

    get() {
        return Models.User.findOrCreate({
            where: this.where,
            defaults: this.defaults
        });
    }
};
