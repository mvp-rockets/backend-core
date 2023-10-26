const path = require('path');
const pubsub = require('PUBSUB/getPubsubClient.js')();
process.env["NODE_CONFIG_DIR"] = `${__dirname}/../config`;
const config = require('config/config');

module.exports.perform = async () => {
    const { topics } = config;
    for (const [key, value] of Object.entries(topics)) {
        const topic = pubsub.topic(value);
        const [topicExists] = await topic.exists();

        if (!topicExists) {
            const [createdTopic] = await pubsub.createTopic(value);
            console.log(`Topic ${createdTopic.name} created.`);
        } else {
            console.log(`Topic ${value} already exists.`);
        }

        const subscriptionName = value + 'Subscription';
        const subscription = topic.subscription(subscriptionName);
        const [subscriptionExists] = await subscription.exists();

        if (!subscriptionExists) {
            await topic.createSubscription(subscriptionName);
            console.log(`Subscription ${subscriptionName} created.`);
        } else {
            console.log(`Subscription ${subscriptionName} already exists.`);
        }
    }
};

