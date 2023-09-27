const pubsub = require('PUBSUB/getPubsubClient.js')();
const config = require('config/config');
const ExportFileSendMailService = require('resources/files/service/export-file-send-mail-service');
const UpdateExportStatusToCompletedQuery = require('resources/exportStatuses/queries/update-export-status-to-completed-query');
const { composeResult } = require('lib');
const db = require('db/repository.js');
const GetUserQuery = require('resources/users/queries/get-user-query')

module.exports = (async function createSubscription() {
  const subscription = await pubsub.subscription(config.topics.ExportProcessedFiles + 'Subscription');

  subscription.on('message', async (message) => {
    const parsedData = JSON.parse(message.data.toString());
    const result = await composeResult(
      () => db.execute(new UpdateExportStatusToCompletedQuery(parsedData.exportStatusId)),
      (user) => ExportFileSendMailService.perform(parsedData, user),
      () => db.find(new GetUserQuery(parsedData.userId))
    )()
    message.ack(result);
  });
  subscription.on('error', (error) => {
    console.error('Subscription error:', error);
  });

  subscription.on('close', () => {
    console.log('Subscription closed.');
  });
}())
