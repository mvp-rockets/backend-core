const AWS = require('aws-sdk');
const fs = require('fs').promises;

const awsConfig = {
  apiVersion: '2017-10-17'
};

if (process.env.AWS_SM_ACCESS_KEY_ID) {
  awsConfig.accessKeyId = process.env.AWS_SM_ACCESS_KEY_ID;
  awsConfig.secretAccessKey = process.env.AWS_SM_SECRET_ACCESS_KEY_ID;
}
if (process.env.AWS_ENDPOINT) {
  awsConfig.endpoint = process.env.AWS_ENDPOINT;
}
if (process.env.AWS_SM_REGION) {
  awsConfig.region = process.env.AWS_SM_REGION;
}

const perform = async () => {
    try {
        const client = new AWS.SecretsManager(awsConfig);
        const SecretId = process.env.AWS_SM_SECRET_ID;
        client.getSecretValue({ SecretId }, async (err, data) => {
            if (err) {
                console.error('error from aws secret', err);
                process.exit(1);
            } else {
                console.log('Got secrets from AWS ');
                const secretsJSON = JSON.parse(data.SecretString);

                let secretsString = '';
                Object.keys(secretsJSON).forEach((key) => {
                    secretsString += `${key}=${secretsJSON[key]}\n`;
                });
                await fs.writeFile(`env/.env.${process.env.APP_ENV}`, secretsString);
                await fs.writeFile('.env', secretsString);
                process.exit(0);
            }
        });
    } catch (error) {
        console.error('error while make connection to aws secret', error);
        process.exit(1);
    }
};

perform();
