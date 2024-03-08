const Result = require('folktale/result');
const db = require('models/index');
const { logError } = require('lib');
module.exports.execute = async (query) => new Promise((resolve) => {
    query
        .get()
        .then((data) => {
            resolve(Result.Ok(data));
        })
        .catch((error) => {
            logError("Repository failed on execute", { query: query.constructor.name, error: error });
            resolve(Result.Error(error));
        });
});

module.exports.executeWithValue = async (query, messageError) => new Promise((resolve) => {
    query
        .get()
        .then((data) => {
            if (!data) {
                logError("Repository failed on executeWithValue", { query: query.constructor.name, error: messageError || 'Not found' });
                resolve(Result.Error(new ApiError('api error', messageError || 'Not found', 404)));
                return;
            }
            resolve(Result.Ok(data));
        })
        .catch((error) => {
            logError("Repository failed on executeWithValue", { query: query.constructor.name, error: error });
            resolve(Result.Error(error));
        });
});

module.exports.perform = async query => new Promise((resolve) => {
    query
        .then((data) => {
            resolve(Result.Ok(data));
        })
        .catch((error) => {
            logError("Repository failed on perform", { error: error });
            resolve(Result.Error(error));
        });
});

module.exports.create = async (query) => new Promise((resolve) => {
    query
        .get()
        .then((data) => {
            resolve(Result.Ok(data));
        })
        .catch((error) => {
            logError("Repository failed on create", { query: query.constructor.name, error: error });
            resolve(Result.Error(error));
        });
});

module.exports.find = async (query) => new Promise((resolve) => {
    query
        .get()
        .then((data) => {
            resolve(Result.Ok(data));
        })
        .catch((error) => {
            logError("Repository failed on find", { query: query.constructor.name, error: error });
            resolve(Result.Error(error));
        });
});

module.exports.findOne = async (query) => new Promise((resolve) => {
    query
        .get()
        .then((data) => {
            resolve(Result.Ok(data));
        })
        .catch((error) => {
            logError("Repository failed on findOne", { query: query.constructor.name, error: error });
            resolve(Result.Error(error));
        });
});

module.exports.bulkCreate = async (query) => new Promise((resolve) => {
    query
        .get()
        .then((data) => {
            resolve(Result.Ok(data));
        })
        .catch((error) => {
            logError("Repository failed on bulk create", { query: query.constructor.name, error: error });
            resolve(Result.Error(error));
        });
});
module.exports.update = async (query) => new Promise((resolve) => {
    query
        .get()
        .then((data) => {
            resolve(Result.Ok(data));
        })
        .catch((error) => {
            logError("Repository failed on update ", { query: query.constructor.name, error: error });
            resolve(Result.Error(error));
        });
});

module.exports.delete = async (query) => new Promise((resolve) => {
    query
        .get()
        .then((data) => {
            resolve(Result.Ok(data));
        })
        .catch((error) => {
            logError("Repository failed on delete", { query: query.constructor.name, error: error });
            resolve(Result.Error(error));
        });
});

module.exports.deleteOne = async (query) => new Promise((resolve) => {
    query
        .get()
        .then((data) => {
            resolve(Result.Ok(data));
        })
        .catch((error) => {
            logError("Repository failed on delete one", { query: query.constructor.name, error: error });
            resolve(Result.Error(error));
        });
});

module.exports.executeAll = arr => new Promise((resolve) => {
    if (!Array.isArray(arr)) {
        resolve(Result.Error('Argument is not an array'));
    }
    const allPromises = arr.map((item) => {
        if (Array.isArray(item)) {
            return item[0].get().catch(error => ({
                error,
                args: item.slice(1)
            }));
        }
        return item.get().catch(error => ({
            error,
            args: []
        }));
    });
    let errorFound = false;
    Promise.all(allPromises).then((results) => {
        results.forEach((result) => {
            if (result && result.error) {
                errorFound = true;
                logError("Repository failed on executeAll", {
                    query: arr,
                    error: result.error
                });
                if (result.args.length === 1 || (result.args.length === 2 && result.args[1].includes('api'))) {
                    resolve(Result.Error(new ApiError(0, 'api error', result.args[0])));
                    return;
                }
                if (result.args.length === 2 && result.args[1].includes('validation')) {
                    resolve(Result.Error(new ValidationError(0, result.args[0], 'validation error')));
                    return;
                }
                resolve(Result.Error(result.error));
            }
        });
        if (!errorFound) {
            resolve(Result.Ok(results));
        }
    });
});

module.exports.executeMultiple = async (queries) => new Promise(async (resolve) => {
    try {
        const result = await db.sequelize.transaction(async (t) => {
            const allResult = queries.map((query) => query.get({ transaction: t }).then((data) => data));
            return Promise.all(allResult);
        });
        resolve(Result.Ok(result));
    } catch (error) {
        logError("Repository failed on execute multiple", { query: queries.map((query) => query.constructor.name).join(","), error: error });
        resolve(Result.Error(error));
    }
});
module.exports.executeMultipleWithoutTx = async (queries) => new Promise(async (resolve) => {
    try {
        const allResult = queries.map((query) => query.get().then((data) => data));
        const resolveAllResult = await Promise.all(allResult);
        resolve(Result.Ok(resolveAllResult));
    } catch (error) {
        logError("Repository failed on executeMultipleWithoutTx", { query: queries.map((query) => query.constructor.name).join(","), error: error });
        resolve(Result.Error(error));
    }
});
