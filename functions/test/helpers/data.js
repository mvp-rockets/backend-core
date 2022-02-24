const DeleteEntityById = require('test/data/delete-entity-by-id');
const definations = require('test/data/factory').factory;


const entity = async (name, replace) => new Promise(async (resolve, reject) => {
    let data = await definations.build(name);
    if (replace) {
        data = replace(data);
    }
    resolve(data);
});

const buildEntity = (name) => entity(name);


module.exports = {
    buildEntity
};
