const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          password:{
            type:DataTypes.STRING,
            allowNull:false
          },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return User;
};
