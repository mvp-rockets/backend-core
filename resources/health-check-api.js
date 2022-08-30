const { logInfo } = require('@napses/namma-lib/utilities');

module.exports = function (req, res) {
    logInfo('Request to get server health-check api', {});

    res.json({
        isHealthy: true
    })
}