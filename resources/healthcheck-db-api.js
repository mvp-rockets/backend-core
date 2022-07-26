const { logInfo } = require('lib/functional/logger');
const {sequelize} = require('models');

module.exports = function (req, res) {
    logInfo('Request to get db-healthcheck status', {});

    sequelize
            .authenticate()
            .then(() => {
                res.json({
                    isAlive: true
                })
            })
            .catch(err => {
                res.json({
                    isAlive: false
                })
            });
}