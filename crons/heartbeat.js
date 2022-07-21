const cronitor = require('cronitor')('1ba63ad81cb24d899fa2bd425d836156');
const monitor = new cronitor.Monitor('important-heartbeat-monitor');

// send a heartbeat event with a message
monitor.ping({message: 'Alive'});

// include counts & error counts
monitor.ping({count: 100, error_count: 3});