const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '..'));
const CreateDeadLetterQueues = require('sqs/create-dead-letter-queues');

const perform = async () => {
    try {
        CreateDeadLetterQueues.perform();
        return;
    } catch (ex) {
        console.error('Create queues failed', ex);
    }
};

perform();
