const { PubSub } = require('@google-cloud/pubsub');
process.env["NODE_CONFIG_DIR"] = `${__dirname}/../config`;
const config = require('config/config');

const pubsub = new PubSub({ projectId: config.projectName });

module.exports = () => pubsub;


