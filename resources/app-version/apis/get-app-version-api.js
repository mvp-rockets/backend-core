const Route = require('route');
const { respond, logInfo } = require('lib');
const config = require('config/config');
const CheckVersionService = require('resources/app-version/services/check-version-service');

const post = async (req) => {
    const {
        versionName, os, buildNumber, osVersion
    } = req.body;

    logInfo('Get app version API', { versionName, os, buildNumber, osVersion });

    const response = await CheckVersionService.perform({
        os,
        versionName,
        config,
    });

    return respond(response, 'Successfully got app version!', 'Failed to get app version!');
};

Route.withOutSecurity().noAuth().post('/app-version', post).bind();