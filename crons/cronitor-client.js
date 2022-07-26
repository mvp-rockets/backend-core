const config = require('config/config');

module.exports = require('cronitor')(config.cronitorSecretKey);
