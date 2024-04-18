const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: `./env/.env.${process.env.APP_ENV}` });
require('app-module-path').addPath(`${path.resolve()}/test`);
require('app-module-path').addPath(`${path.resolve()}/`);
require('../../api-routes');
