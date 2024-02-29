const chai = require("chai");
const expect = chai.expect;
const { verifyResultOk } = require("helpers/verifiers.js");
const db = require('db/repository');
const ds = require('helpers/dataSetup')
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query')

describe('Create or find user query', () => {
    let user;
    beforeEach(async () => {
        user = await ds.buildSingle(ds.user)
    })

    it('should create a user with valid data when user not exist', async () => {
        const responce = await db.execute(new CreateOrFindUserQuery({ where: { email: user.email }, defaults: { ...user } }));
        verifyResultOk(
            ([createdUser, isNew]) => {
                expect(isNew).eql(true);

                expect(user.id).eql(createdUser.id);
                expect(user.username).eql(createdUser.username);
                expect(user.password).eql(createdUser.password);
            }
        )(responce)
    })

    it('should find a user', async () => {
        await db.execute(new CreateOrFindUserQuery({ where: { email: user.email }, defaults: { ...user } }));

        const responce = await db.execute(new CreateOrFindUserQuery({ where: { email: user.email }, defaults: { ...user } }));
        verifyResultOk(
            ([createdUser, isNew]) => {
                expect(isNew).eql(false);
                expect(user.id).eql(createdUser.id);
                expect(user.username).eql(createdUser.username);
                expect(user.password).eql(createdUser.password);
            }
        )(responce)
    })

    after(async () => {
        await ds.deleteAll();
    })
})