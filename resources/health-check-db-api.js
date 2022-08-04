const { logInfo } = require('lib/functional/logger');
const {sequelize} = require('models');

module.exports = function (req, res) {
    logInfo('Request to get health-check db api', {});

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