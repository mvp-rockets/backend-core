const { factory } = require('factory-girl');

const loadFactory = async () => {

    factory.define('user', Object, {
        id: factory.chance("guid"),
        email: factory.chance('email'),
        username: factory.chance('name'),
        password: factory.chance("word"),
        gender: factory.chance('pickone', ['M', 'F', 'O']),
        age: factory.chance('integer', {min: 18, max: 60})
    });
};

module.exports.factory = factory;
module.exports.loadFactory = loadFactory;
