const chai = require("chai");
const expect = chai.expect;
const { verifyResultOk, verifyResultError } = require("helpers/verifiers.js");
const db = require('db/repository');
const ds= require('helpers/dataSetup')
const RunQuery = require('data/run-query');
const CreateUserQuery = require('resources/users/queries/create-user-query')

describe('Create user query', () => {
     let user;
    beforeEach(async() =>{
       user =await ds.buildSingle(ds.user)
    })

    it('should create a user with valid data', async() =>{
        const createUserQueryResponce = await db.execute(new CreateUserQuery(user));
        verifyResultOk(
            (createdUser)=>{
                expect(user.id).eql(createdUser.id);
                expect(user.username).eql(createdUser.username);
                expect(user.password).eql(createdUser.password);
            }
        )(createUserQueryResponce)

        const fetchUserResponce = await db.findOne(new RunQuery('select * from "users" where username=:username',{username:user.username}))
        verifyResultOk(
            (createdUser)=>{
                expect(user.id).eql(createdUser.id);
                expect(user.username).eql(createdUser.username);
                expect(user.password).eql(createdUser.password);
            }
        )(fetchUserResponce)


    })


    after(async() =>{
        await ds.deleteAll();
    })
})