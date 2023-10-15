const fs = require('fs').promises;
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { GoogleAuth } = require('google-auth-library');
const config = require('./config/config.js');

const perform = async () => {
  try {
    async function listSecrets() {
      // Create a client for the Secret Manager API
      const client = new SecretManagerServiceClient();
      // Load the service account key file
      const auth = new GoogleAuth({
        keyFile: config.serviceProviderConfig.gcp.keyFile
      });
      // Get the project ID from the environment variable
      const projectId = config.serviceProviderConfig.gcp.projectName;
      // Build the parent resource name
      const parent = `projects/${projectId}`;

      // Call the API to list the secrets in the project
      const [secrets] = await client.listSecrets({ parent });
      console.log('Got secrets from GCP ');
      let secretsString = '';
      for (const secret of secrets) {
        const [version] = await client.accessSecretVersion({
          name: secret.name + '/versions/latest'
        });
        secretsString += `${secret.name.split('/')[secret.name.split('/').length - 1]}=${version.payload.data.toString()}\n`;
      }
      await fs.writeFile(`env/.env.${process.env.NODE_ENV}`, secretsString);
      await fs.writeFile('.env', secretsString);
      process.exit(0);
    }

    listSecrets();
  } catch (error) {
    console.log('error from gcp secret', err);
    process.exit(1);
  }
};
perform();