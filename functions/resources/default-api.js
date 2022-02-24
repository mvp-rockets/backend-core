const Route = require('route');
const { logInfo } = require('lib/functional/logger');
const { respond } = require('lib');
const Result = require('folktale/result');
const config = require('config/config');

async function get(req) {
    logInfo('Request to get default api ', {});

    const result = Result.Ok({
        projectName: 'Postgress-aws-sm',
        apiPort: config.apiPort,
        env: config.env
    });

    return respond(result, 'Successfully get default api!', 'Failed to get default api!');
}

Route.withOutSecurity().noAuth().get('/', get).bind();

module.exports.get = get;
