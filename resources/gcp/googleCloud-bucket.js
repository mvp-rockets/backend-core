const { Storage } = require('@google-cloud/storage');
const config = require('config/config.js');

const gcpBucket = new Storage().bucket(config.bucketName);

const getGcpCloudStorageFile = async (filePath) => {
    return gcpBucket.file(filePath)
        .download();
}

const getPreSignedUrl = async (url) => {
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 1 * 60 * 1000, // 1 minutes
    };
    const [url] = await gcpBucket.file(url).getSignedUrl(options);
    return url
}

const getUploadPreSignedUrl = async (url) => {
    const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
    const [url] = await gcpBucket.file(url).getSignedUrl(options);

}

module.exports = { gcpBucket, getGcpCloudStorageFile, getPreSignedUrl, getUploadPreSignedUrl }
