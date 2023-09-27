const pubsub = require('PUBSUB/getPubsubClient.js')();
const Result = require('folktale/result');
const { logInfo, logError } = require('lib');

module.exports.perform = async (topicName, messageData) => {
    logInfo('Request to publish topic', { messageData, topicName });
    try {
        const dataBuffer = Buffer.from(messageData);
        const messageId = await pubsub.topic(topicName).publish(dataBuffer);
        logInfo('Publish topic Success', { messageId });
        return Result.Ok({})
    }
    catch (err) {
        logError('Publish topic failed', { message: err.message });
        return Result.Error(err);
    }

}
