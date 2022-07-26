const { logInfo } = require('lib/functional/logger');

module.exports = function (req, res) {
    logInfo('Request to get server healthcheck status', {});

    res.json({
        isHealthy: true
    })
}