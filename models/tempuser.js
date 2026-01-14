'use strict';
const {
  Model, Sequelize
} = require('sequelize');
var EncryptedField = require('sequelize-encrypted');

const key1 = 'a593e7f567d01031d153b5af6d9a25766b95926cff91c6be3438c7f7ac37230e';
const key2 = 'a593e7f567d01031d153b5af6d9a25766b95926cff91c6be3438c7f7ac37230f';

const v1 = EncryptedField(Sequelize, key1);

module.exports = (sequelize, DataTypes) => {
  class TempUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TempUser.init({
    name: DataTypes.STRING,
    encryptedEmailPassword: v1.vault('encryptedEmailPassword'),
    email:  v1.field('email'),
    password:  v1.field('password')
  }, {
    sequelize,
    modelName: 'TempUser',
    tableName: 'temp_users',
    underscored: true
  });
  return TempUser;
};