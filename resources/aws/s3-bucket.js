const config = require('config/config');
const AWS = require('aws-sdk');
const Result = require('folktale/result');

const awsS3  = config.serviceProviderConfig.awsS3;
const path = require('path');
const mime = require('mime');
const { logError } = require('@mvp-rockets/namma-lib/utilities');
const { bucketAcl } = require('config/config');
const cloudFrontFolders = {};

if (awsS3.access_key_id && awsS3.secret_access_key) {
    AWS.config.update({
        accessKeyId: awsS3.access_key_id,
        secretAccessKey: awsS3.secret_access_key,
    });
}
AWS.config.update({
    region: awsS3.region
});

const s3Bucket = new AWS.S3({
    params: {
        Bucket: awsS3.bucketName
    }
});

const getSignedUrl = (fileKey) => new Promise((resolve, reject) => {
    const params = {
        Bucket: awsS3.bucketName,
        Key: fileKey
    };

    s3Bucket.getSignedUrl('getObject', params, (err, data) => {
        if (err) {
            return reject(new Error(Result.Error('some error occurred')));
        }
        return resolve(Result.Ok(data));
    });
});

const getUploadPreSignedUrl = (fileKey) => new Promise((resolve, reject) => {
    const extension = path.extname(fileKey);
    const extensionContentType = mime.getType(extension);
    const contentType = extensionContentType.split('/');
    const actualContentType = `${contentType[0]}/`;

    const bucketParams = {
        Bucket: awsS3.bucketName,
        Expires: 3600,
        Fields: {
            key: fileKey
        },
        Conditions: [
            ['starts-with', '$Content-Type', actualContentType]
        ]
    };

    s3Bucket.createPresignedPost(bucketParams, (err, data) => {
        if (err) {
            logError('aws upload presigned error', { err });
            return reject(new Error(Result.Error('some error occurred')));
        }

        return resolve(Result.Ok(data));
    });
});

const getObject = (fileKey) => new Promise((resolve, reject) => {
    const params = {
        Bucket: awsS3.bucketName,
        Key: fileKey
    };

    s3Bucket.getObject(params, (err, data) => {
        if (err) {
            return reject(new Error(Result.Error('some error occurred')));
        }
        return resolve(Result.Ok(data));
    });
});

const getCloudFrontUrl = (fileKey, folder) => {
    const { cloudFrontUrl } = awsS3;
    const cloudFrontFolder = cloudFrontFolders[folder];
    if (cloudFrontUrl && cloudFrontFolder) {
        const fileName = fileKey?.split(cloudFrontFolder)[1];
        return `${cloudFrontUrl}${fileName}`;
    }

    return `https://${awsS3.bucketName}.s3.${awsS3.region}.amazonaws.com/${fileKey}`;
};

module.exports = {
    s3Bucket, Bucket: awsS3.bucketName, getSignedUrl, getUploadPreSignedUrl, getObject, getCloudFrontUrl
};
