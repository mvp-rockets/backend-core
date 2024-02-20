const { createClient } = require('redis');
const { ApiError, logError } = require('lib');
const Result = require('folktale/result');
const { redis } = require('config/config');

let client;
async function startRedis() {
    try {
        let url = `redis://${redis.host}:${redis.port}`;
        if (redis.username && redis.password) {
            url = `redis://${redis.username}:${redis.password}@${redis.host}:${redis.port}`;
        }
        client = createClient({ url });
        await client.connect();

        client.on('error', (err) => {
            console.log(`Error occured during connection with redis. ${err}`);
        });
        client.on('connect', () => {
            console.log('Connected to redis successfully :)');
        });
    } catch (err) {
        console.log(`Could not establish a connection with redis. ${err}`);

    }
}
startRedis();

module.exports.getRedisData = async (key) => {
    try {
        const value = await client.get(key);
        return Result.Ok(value);
    } catch (err) {
        logError('redis get error', {
            key, err: err.message
        });
        return Result.Ok(null);
    }
};
module.exports.setRedisData = async ({ key, value }) => {
    try {
        const data = await client.set(key, value);
        return Result.Ok(data);
    } catch (err) {
        logError('redis set error', {
            key, value, err
        });
        return Result.Error(new ApiError('redis set error', err.message, 400));
    }
};
module.exports.getAllPatternValue = async (pattern) => {
    try {
        const keys = await client.keys(pattern);
        const values = await client.mGet(keys);
        const peerKeys = await client.keys('peer_*');
        const peerValues = await client.mGet(peerKeys);
        return Result.Ok(values.map((item, index) => {
            const username = keys[index].split(pattern.replace('*', ''))[1];
            const peerIndex = peerKeys.findIndex((e) => e === `peer_${username}`);
            return { username, status: item, peerId: peerValues[peerIndex] };
        }));
    } catch (err) {
        logError('redis getAllPatternValue error', {
            pattern, err
        });
        return Result.Error(new ApiError('redis getAllPatternValue error', err.message, 400));
    }
};
module.exports.flushAll = async () => {
    try {
        await client.flushAll('ASYNC');
    } catch (err) {
        logError('redis flushAll error', {
            err
        });
    }
};
module.exports.offlineAll = async () => {
    try {
        const keys = await client.keys('user_*');
        await client.mSet(keys.map((key) => [key, 'OFFLINE']));
    } catch (err) {
        logError('redis flushAll error', {
            err
        });
    }
};
module.exports.mSet = async (data) => {
    try {
        const res = await client.json.mSet(data);
        return res;
    } catch (err) {
        logError('redis flushAll error', {
            err
        });
        return [];
    }
};

module.exports.getRedisJsonData = async (key) => {
    try {
        const data = await client.json.get(key);
        return Result.Ok(data);
    } catch (err) {
        logError('redis set error', {
            key, err
        });
        return Result.Error(err.message);
    }
};

module.exports.setRedisJsonData = async (key, position, value) => {
    try {
        const data = await client.json.set(key, position, value);
        return Result.Ok(data);
    } catch (err) {
        logError('redis set error', {
            key, value, err
        });
        return Result.Error(err.message);
    }
};

module.exports.mergeJsonData = async (key, path, value) => {
    try {
        const data = await client.json.merge(key, path, value);
        return Result.Ok(data);
    } catch (err) {
        logError('redis set error', {
            key, value, err
        });
        return Result.Error(err.message);
    }
};

module.exports.createIndex = async (name, schema, type) => {
    try {
        const { ft } = client;

        const idxList = await ft._list();

        if (idxList.includes(name)) {
            const res = await ft.dropIndex(name);
            console.log('Dropping existing index', res);
        }

        const value = await ft.create(name, schema, type);

        return Result.Ok(value);
    } catch (err) {
        logError('redis create index error', {
            err: err.message
        });
        return Result.Error(err.message);
    }
};

module.exports.searchRedisData = async (index, search, opts = {}) => {
    try {
        const value = await client.ft.search(index, search, opts);
        return Result.Ok(value);
    } catch (err) {
        logError('redis search error', {
            err: err.message
        });
        console.log('ERROR', err);
        return Result.Error(null);
    }
};

module.exports.jsonGet = async (key) => {
    try {
        const value = await client.json.get(key);
        return Result.Ok(value);
    } catch (err) {
        logError('redis JSON get error', {
            err: err.message
        });
        return Result.Error(null);
    }
};

module.exports.jsonMGet = async (keys, path) => {
    try {
        const value = await client.json.mGet(keys, path);
        return Result.Ok(value);
    } catch (err) {
        logError('redis JSON mGet error', {
            err: err.message
        });
        return Result.Error(null);
    }
};

module.exports.aggregate = async (index, search, opts = {}) => {
    try {
        const value = await client.ft.aggregate(index, search, opts);
        return Result.Ok(value);
    } catch (err) {
        logError('redis aggrregate error', {
            err: err.message
        });
        console.log('ERROR', err);
        return Result.Error(null);
    }
};

module.exports.deleteRedisJsonData = async (key) => {
    try {
        const data = await client.json.del(key);
        return Result.Ok(data);
    } catch (err) {
        logError('redis set error', {
            key
        });
        return Result.Error(err.message);
    }
};

module.exports.redis = client;