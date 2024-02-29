const chai = require('chai');
const { verifyResultOk } = require('helpers/verifiers');
const db = require('db/repository');
const ds = require('helpers/dataSetup');
const GetOneUserByConditionQuery = require('resources/users/queries/get-one-user-by-condition-query');

const { expect } = chai;

describe('Get one user by condition query', () => {
    let user1;

    beforeEach(async () => {
        user1 = await ds.createSingle(ds.user);
    });

    it('should get one users', async () => {
        const fetchedUsers = await db.find(new GetOneUserByConditionQuery({ id: user1.id }));

        verifyResultOk((user) => {
            expect(user.id).to.be.eql(user1.id);
        })(fetchedUsers);
    });
    after(async () => {
        await ds.deleteAll();
    });
});
