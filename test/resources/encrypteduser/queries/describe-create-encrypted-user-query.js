
const Models = require('models');
const sequelize = require('sequelize');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { expect } = chai;
chai.use(sinonChai);



describe('using pgcrypto', () => {


    it('create encrypted user with symetric key', async () => {
        const symetricKey = 'zJMFdweqCJq0swjN5P+snTSoqOv0QcCJr/T+Z7iKjsQ=';
        const user = {
            name: 'John Smith',
            email: 'john.smith@gmail.com',
            age: '23'
        };
        const createdUser = await Models.EncryptedUser.create({
            name: sequelize.fn('PGP_SYM_ENCRYPT', user.name, symetricKey),
            email: sequelize.fn('PGP_SYM_ENCRYPT', user.email, symetricKey),
            age: sequelize.fn('PGP_SYM_ENCRYPT', user.age, symetricKey)   
        });
       
        const found = await Models.EncryptedUser.findOne({
            where: {
                id: createdUser.id
            },
            attributes: [
                [sequelize.fn('PGP_SYM_DECRYPT', sequelize.cast(sequelize.col('name'), 'bytea'), symetricKey), 'name'],
                [sequelize.fn('PGP_SYM_DECRYPT', sequelize.cast(sequelize.col('email'), 'bytea'), symetricKey), 'email'],   
                [sequelize.fn('PGP_SYM_DECRYPT', sequelize.cast(sequelize.col('age'), 'bytea'), symetricKey), 'age']
            ]
        });

        console.log("🚀 ~ it ~ found:", found)
        expect(found.email).to.be.equal(user.email);
    });

    it('should search encrypted user with symetric key', async () => {
        const symetricKey = 'zJMFdweqCJq0swjN5P+snTSoqOv0QcCJr/T+Z7iKjsQ=';
        const user = {
            name: 'John Smith',
            email: 'john.smith@gmail.com',
            age: '23'
        };
        const createdUser = await Models.EncryptedUser.create({
            name: sequelize.fn('PGP_SYM_ENCRYPT', user.name, symetricKey),
            email: sequelize.fn('PGP_SYM_ENCRYPT', user.email, symetricKey),
            age: sequelize.fn('PGP_SYM_ENCRYPT', user.age, symetricKey)   
        });

        const found = await Models.EncryptedUser.findOne({
            where: sequelize.where(
                sequelize.fn('PGP_SYM_DECRYPT', sequelize.cast(sequelize.col('name'), 'bytea'), symetricKey), {
                    [sequelize.Op.eq]: `${user.name}`
                }
            ),
            attributes: [
                [sequelize.fn('PGP_SYM_DECRYPT', sequelize.cast(sequelize.col('name'), 'bytea'), symetricKey), 'name'],
                [sequelize.fn('PGP_SYM_DECRYPT', sequelize.cast(sequelize.col('email'), 'bytea'), symetricKey), 'email'],   
                [sequelize.fn('PGP_SYM_DECRYPT', sequelize.cast(sequelize.col('age'), 'bytea'), symetricKey), 'age']
            ],
            logging: true
        });

        console.log("🚀 ~ it ~ found:", found)
        expect(found.email).to.be.equal(user.email);
    });
});