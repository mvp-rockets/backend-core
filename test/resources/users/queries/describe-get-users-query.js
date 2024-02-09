// const chai = require('chai');
// const { verifyResultOk } = require('helpers/verifiers');
// const db = require('db/repository');
// const ds = require('helpers/dataSetup');
// const GetUsersQuery = require('resources/users/queries/get-users-query');

// const { expect } = chai;

// describe('get users query', () => {
//     let user1;
//     let user2;

//     beforeEach(async () => {
//         user1 = await ds.createSingle(ds.user);
//         user2 = await ds.createSingle(ds.user);
//     });

//     it('should get all users', async () => {
//         const fetchedUsers = await db.find(new GetUsersQuery());
        
//         verifyResultOk(() => {
//             expect(fetchedUsers.value).to.be.an('array');
//             expect(fetchedUsers.value.map((item) => item.username)).to.include(user1.username);
//             expect(fetchedUsers.value.map((item) => item.username)).to.include(user2.username);
//             expect(fetchedUsers.value.map((item) => item.password)).to.include(user1.password);
//             expect(fetchedUsers.value.map((item) => item.password)).to.include(user2.password);
//         })(fetchedUsers);
//     });
//     after(async () => {
//         await ds.deleteAll();
//     });
// });
