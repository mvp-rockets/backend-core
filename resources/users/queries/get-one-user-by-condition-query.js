const Models = require('models');


module.exports = class GetOneUserByConditionQuery {
    constructor(where) {
        this.where = where
    }

    async get() {
        return Models.User.findOne({
            where: this.where
        });
    }
}