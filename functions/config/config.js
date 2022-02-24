module.exports = {
    apiPort: process.env.API_PORT,
    env: process.env.ENVIRONMENT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    dialect: process.env.DB_DIALECT,
    seederStorage: process.env.DB_SEEDER_STORAGE,
    awsS3: {
        access_key_id: process.env.AWS_S3_ACCESS_KEY_ID,
        secret_access_key: process.env.AWS_S3_SECRET_ACCESS_KEY,
        region: process.env.AWS_S3_REGION,
        bucketName: process.env.AWS_S3_BUCKET_NAME
    }
};
