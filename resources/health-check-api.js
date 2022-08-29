const { utilities: { logInfo } } = require('@napses/namma-lib');

module.exports = function (req, res) {
    logInfo('Request to get server health-check api', {});

    res.json({
        isHealthy: true
    })
}