const Route = require('route');
const { respond, logInfo } = require('lib');
const Result = require('folktale/result');

async function get() {
    logInfo('Request to check health api ', {});

    const result = await Result.Ok({ isHealthy: true });

    return respond(result, 'Successfully checked health api!', 'Failed to check health api!');
}

Route.withOutSecurity().noAuth().get('/healthz', get).bind();

module.exports.get = get;
