const fs = require('fs');
const path = require('path');
require('pg').defaults.parseInt8 = true;
const Sequelize = require('sequelize');

const basename = path.basename(__filename);


const db = {};
const dbConfig = {
    host: '',
    username: '',
    password: '',
    database: '',
    dialect: '',
    seederStorage: ''
};
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

fs
    .readdirSync(__dirname)
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize.options.logging = true;
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
