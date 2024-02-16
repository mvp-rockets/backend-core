const {
	isBoolean,
	hasLengthOf,
	isEmail,
	isMobileNumber,
	isStringNumeric,
	isUndefined,
	maxValue,
	minValue,
	notEmpty,
	numeric,
	shouldBeUuid,
	isTimestamp,
	validate
} = require('@mvp-rockets/namma-lib/validations');

const isValidUrl = (url) => {
	try {
		return Boolean(new URL(url));
	} catch (err) {
		return false;
	}
}

module.exports = {
	isBoolean,
	hasLengthOf,
	isEmail,
	isMobileNumber,
	isStringNumeric,
	isUndefined,
	maxValue,
	minValue,
	notEmpty,
	numeric,
	shouldBeUuid,
	isTimestamp,
	validate,
	isValidUrl
};
