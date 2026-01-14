'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EncryptedUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EncryptedUser.init({
    name: DataTypes.STRING,
    age: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EncryptedUser',
    tableName: 'encrypted_users',
    underscored: true
  });
  return EncryptedUser;
};