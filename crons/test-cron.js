const cronitor = require('crons/crontier-client.js');
const { logInfo, logError } = require('lib/functional/logger');
const cron = require('cron');
cronitor.wraps(cron);

cronitor.schedule('SendWelcomeEmail', '*/2 * * * *', function() {
    console.log('Sending welcome email to new sign ups every five minutes.');
});