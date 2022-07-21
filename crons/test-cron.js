const cronitor = require('cronitor')('1ba63ad81cb24d899fa2bd425d836156');
const { logInfo, logError } = require('lib/functional/logger');
const cron = require('cron');
cronitor.wraps(cron);

cronitor.schedule('SendWelcomeEmail', '*/2 * * * *', function() {
    console.log('Sending welcome email to new sign ups every five minutes.');
});