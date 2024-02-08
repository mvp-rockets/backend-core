const { sequelize } = require('models');
const Result = require('folktale/result');

module.exports.isDbAlive = function isDbAlive() {
    return new Promise((resolve) => {
        sequelize
            .authenticate()
            .then(() => {
                resolve(Result.Ok({
                    isAlive: true
                }))
            })
            .catch((error) => {
                resolve(Result.Error({
                    error,
                    isAlive: false
                }))
            });
    });
}
