const cronitor = require('crons/cronitor-client.js');
const monitor = new cronitor.Monitor('important-heartbeat-monitor');

// send a heartbeat event with a message
monitor.ping({message: 'Alive'});

// include counts & error counts
monitor.ping({count: 100, error_count: 3});