const composeResult = require('@mvp-rockets/namma-lib/src/lib/utilities/compose-result');
const ifElse = require('@mvp-rockets/namma-lib//src/lib/utilities/ifElse');
const respond = require('@mvp-rockets/namma-lib//src/lib/utilities/respond');
const transformToResult = require('@mvp-rockets/namma-lib//src/lib/utilities/transform-to-result');
const whenResult = require('@mvp-rockets/namma-lib//src/lib/utilities/whenResult');
const withArgs = require('@mvp-rockets/namma-lib//src/lib/utilities/with-args');
const doNothing = require('@mvp-rockets/namma-lib//src/lib/utilities/doNothing');
const args = require('@mvp-rockets/namma-lib//src/lib/utilities/args');
const utilityLogger = require('@mvp-rockets/namma-lib//src/lib/utilities/logger');
const uuid = require('@mvp-rockets/namma-lib//src/lib/utilities/uuid');
const ApiError = require('@mvp-rockets/namma-lib//src/lib/utilities/api-error');

const token = require('@mvp-rockets/namma-lib/src/lib/token');
const OtpService = require('lib/otp-service');

module.exports = {
	logInfo: utilityLogger.logInfo,
	logError: utilityLogger.logError,
	logDebug: utilityLogger.logDebug,
	composeResult,
	ifElse,
	respond,
	transformToResult,
	whenResult,
	withArgs,
	doNothing,
	uuid: { ...uuid, v4: () => uuid.v4() },
	args,
	token,
	OtpService,
	ApiError
};
