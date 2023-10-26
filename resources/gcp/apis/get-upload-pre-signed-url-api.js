const Route = require('route');
const { logInfo, respond } = require('lib');
const GCP = require('../googleCloud-bucket');

const post = async (req) => {
    const { fileKey } = req.body;

    logInfo('Request to fetch presigned url', { fileKey });

    const response = await GCP.getUploadPreSignedUrl(fileKey);

    return respond(response, 'Successfully fetched presigned url!', 'Failed to fetch presigned url!');
};

Route.withSecurity().noAuth().post('/gcp/get-upload-pre-signed-url', post).bind();

module.exports.post = post;
