const deleteEntityById = require('test/data/delete-entity-by-id');
const definations = require('test/data/factory').factory;
const CreateUserQuery = require('resources/users/queries/create-user-query');

const entity = async (name, replace) => new Promise(async (resolve, reject) => {
    let data = await definations.build(name);
    if (replace) {
        data = replace(data);
    }
    resolve(data);
});

const buildEntity = (name) => entity(name);

const user = {
    name: "user",
    create: (user) => [new CreateUserQuery(user)],
    build: () => entity("user"),
    delete: (user) => [new deleteEntityById(user.username, "users")],
  };
  

module.exports = {
    buildEntity,
    user
};
