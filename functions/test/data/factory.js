const { factory } = require('factory-girl');

const loadFactory = async () => {
    factory.define('user', Object, {
        id: factory.chance('guid'),
        mobile: factory.chance('phone', { mobile: true }),
        countryCode: factory.chance('integer', { min: 1, max: 1000 }),
        timezone: factory.chance('city')
    });
};

module.exports.factory = factory;
module.exports.loadFactory = loadFactory;
