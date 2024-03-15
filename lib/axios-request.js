const Result = require('folktale/result');
const axios = require('axios');
const { HTTP_CONSTANT } = require('@mvp-rockets/namma-lib');
const { logInfo, logError, ApiError } = require('@mvp-rockets/namma-lib/utilities');

module.exports.post = async ({ url, body, headers }) => {
    logInfo('Making request for', { url, body, headers });
    try {
        const { data } = await axios.post(url, body, { headers });
        return Result.Ok(data);
    } catch (error) {
        logError('error', { error });
        return Result.Error(new ApiError(error.message, 'Validation Failed', HTTP_CONSTANT.BAD_REQUEST));
    }
};
module.exports.get = async ({
    url, params = {}, headers = {}, timeout = 0
}) => {
    logInfo('Making get request for', { url, params, headers });
    try {
        const { data } = await axios.get(url, { params, headers, timeout });
        return Result.Ok(data);
    } catch (error) {
        logError('error', { error });
        return Result.Error(new ApiError(error.message, 'Validation Failed', HTTP_CONSTANT.BAD_REQUEST));
    }
};
module.exports.getWithResponse = async ({
    url, params = {}, headers = {}, timeout = 0
}) => {
    logInfo('Making get request for', { url, params, headers });
    try {
        const { data } = await axios.get(url, { params, headers, timeout });
        return Result.Ok(data);
    } catch (error) {
        logError('error', { error, errorResponse: error.response.data });
        return Result.Error(new ApiError(error.response.data, 'Validation Failed', HTTP_CONSTANT.BAD_REQUEST));
    }
};
