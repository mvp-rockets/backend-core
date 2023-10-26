const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '..'));
const dotenv = require('dotenv');
dotenv.config({ path: `../env/.env.${process.env.NODE_ENV}` });
process.env["NODE_CONFIG_DIR"] = `${__dirname}/../config`;
const CreateTopicForPubsub = require('PUBSUB/create-topic-for-pubsub.js');

const perform = async () => {
    try {
        await CreateTopicForPubsub.perform();
        return;
    } catch (ex) {
        console.log('Create topic failed', ex);
        return ex;
    }
};

perform();
