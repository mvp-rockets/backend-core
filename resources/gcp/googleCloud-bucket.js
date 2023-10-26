const { Storage } = require('@google-cloud/storage');
const config = require('config/config.js');
const Result = require('folktale/result');

const gcpBucket = new Storage().bucket(config.serviceProviderConfig.gcp.bucketName);

const getGcpCloudStorageFile = async (filePath) => {
    return gcpBucket.file(filePath)
        .download();
}

const getPreSignedUrl =  (url) => new Promise((resolve,reject)=>{
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 1 * 60 * 1000, // 1 minutes
    };

    gcpBucket.file(url).getSignedUrl(options,(err,data)=>{
        if (err) {
            return reject(new Error(Result.Error('some error occurred')));
        }
        return resolve(Result.Ok(data));
    });
})


const getUploadPreSignedUrl =  (url) => new Promise((resolve,reject)=>{
    const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    gcpBucket.file(url).getSignedUrl(options,(err,data)=>{
        if (err) {
            return reject(new Error(Result.Error('some error occurred')));
        }
        return resolve(Result.Ok(data));
    });
})
module.exports = { gcpBucket, getGcpCloudStorageFile, getPreSignedUrl, getUploadPreSignedUrl }
