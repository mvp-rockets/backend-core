const config = require('config/config');
let cronitorObj = null;

const cronitorClient = function(cronitorSecretKey) {
    if (cronitorSecretKey) {
        cronitorObj = require('cronitor')(cronitorSecretKey);
    }
    else {
        cronitorObj = {};
        cronitorObj.jobs = new Map();

        cronitorObj.wraps = function(lib) {
            cronitorObj.lib = lib;
        }
        cronitorObj.schedule = function(key, schedule, callback) {
            let job = cronitorObj.lib.CronJob.from({
                cronTime: schedule, 
                onTick: callback 
            });
            job.start();
            cronitorObj.jobs.set(key, job);
        }
    }

    return cronitorObj;
}
module.exports = cronitorClient(config.cronitorSecretKey);
