const serviceProvider = {
    gcp: {
        projectName: process.env.GOOGLE_PROJECT_NAME,
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        logStreamName: process.env.GOOGLE_LOG_STREAM_NAME,
        enableGcpLogger: process.env.GOOGLE_LOG_ENABLE === 'true',
        bucketName: process.env.GOOGLE_BUCKET_NAME
    }
}