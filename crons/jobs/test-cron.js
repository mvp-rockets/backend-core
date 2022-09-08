const cronitor = require('crons/cronitor-client.js');
const cron = require('cron');
cronitor.wraps(cron);

cronitor.schedule('SendWelcomeEmail', '*/2 * * * *', function() {
    console.log('Sending welcome email to new sign ups every five minutes.');
});