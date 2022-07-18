const DeleteEntityById = require('test/data/delete-entity-by-id');
const definations = require('test/data/factory').factory;
const AddUserQuery = require('resources/users/queries/add-user-query');

const entity = async (name, replace) => new Promise(async (resolve, reject) => {
    let data = await definations.build(name);
    if (replace) {
        data = replace(data);
    }
    resolve(data);
});

const buildEntity = (name) => entity(name);

const user = {
    name: 'user',
    create: (user) => [new AddUserQuery({ id: user.id, name: user.name })],
    build: () => entity('user'),
    delete: (user) => [new DeleteEntityById(user.id, 'User')]
};

module.exports = {
    buildEntity,
    user
};
