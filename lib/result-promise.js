const Result = require('folktale/result');
const { logError, ApiError, logInfo } = require('@mvp-rockets/namma-lib/utilities');

module.exports.getResultData = (result) => result.matchWith({
    Ok: ({ value }) => ({ value, status: true }),
    Error: () => ({ status: false, value: null })
});
module.exports.ResultPromiseAll = async (promises, errMessage = 'something went wrong') => {
    try {
        const data = await Promise.all(promises);
        logInfo('result promise data', data);
        if (data.some((promise) => !this.getResultData(promise).status)) {
            logError('some promise failed', { errMessage });
            return Result.Error(new ApiError('api error', errMessage, 400));
        }
        return Result.Ok(data.map((e) => e.value));
    } catch (error) {
        logError('result promise all failed', { error });
        return Result.Error(new ApiError('api error', errMessage, 400));
    }
};
