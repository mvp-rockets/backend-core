const Route = require('route');
const { respond, logInfo } = require('lib');
const Result = require('folktale/result');
const R = require('ramda');
const CheckDbHealthService = require('resources/healthz/services/check-db-health-service');
const { redis } = require('utils/redis');

async function get(req) {
    const { type } = req.params;

    logInfo('Request to check server api ', { type });

    const check = R.cond([
        [R.propEq('db', 'type'), () => CheckDbHealthService.isDbAlive()],
        [R.propEq('redis', 'type'), () => Result.Ok({ isAlive: redis.isReady })],
        [R.T, () => Result.Error(`Invalid request type`)]
    ]);

    const result = await check({ type });

    return respond(result, 'Successfully checked server health api!', 'Failed to check server health api!');
}

Route.withOutSecurity().noAuth().get('/healthz/:type', get).bind();

module.exports.get = get;
