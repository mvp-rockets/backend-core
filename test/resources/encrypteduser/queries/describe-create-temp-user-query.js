
const Models = require('models');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { expect } = chai;
chai.use(sinonChai);

describe('sequelize-encrypted', () => {

    it('should save an encrypted field', async () => {
        const user = await Models.TempUser.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
        });
       
        const found = await Models.TempUser.findOne({
            where: {
                id: user.id
            }
        });
        expect(found.email).to.be.equal(user.email);
    });
       

    it('should support multiple encrypted fields', async() => {
       
        const user = await Models.TempUser.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123'
        });

        const found = await Models.TempUser.findOne({
            where: {
                id: user.id
            }
        });
        expect(found.email).to.be.equal(user.email);
        expect(found.password).to.be.equal(user.password);
    });
});