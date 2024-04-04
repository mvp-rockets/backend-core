const cronitor = require('crons/cronitor-client.js');
const cron = require('cron');
cronitor.wraps(cron);

cronitor.schedule('TestCronJob', '*/2 * * * *', function() {
    console.log('Test Cron Job running every 5 mins');
});
