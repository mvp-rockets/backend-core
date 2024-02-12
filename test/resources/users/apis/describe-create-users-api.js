const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const TestRoutes = require("helpers/test-route");
chai.use(sinonChai);
const uuid = require("uuid");
const db = require("db/repository");
const {
  resolveError,
  validationError,
  resolveDbResult,
  resolveOk,
} = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const CreateUserQuery = require("resources/users/queries/create-user-query");
const createUserValidations= require('resources/users/validators/create-user-validations')

describe("describe user create api", () => {
  let sandbox = sinon.createSandbox();
  let req, res;
  beforeEach(() => {

    req = {
      body: {
        username: "dheeraj",
        password: "dheeraj123"
      },
    };
    res = {
      setHeader: sandbox.spy(),
      send: sandbox.spy(),
      status: sandbox.spy(() => {
        return res;
      }),
    };
  });
  it("should create a new user when correct credentials are passed", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(CreateUserQuery);
          expect(query).to.have.property('username', 'dheeraj');
          expect(query).to.have.property('password', 'dheeraj123');
        })
      )
      .returns(
        resolveOk({
          username: "dheeraj",
          password: "dheeraj123"
        })
      );
  
    const response = await TestRoutes.execute("/users", "Post", req, res);
  
    expect(response).to.be.eql({
      status: true,
      message: "Successfully create users!",
      entity: {
        username: "dheeraj",
        password: "dheeraj123"
      },
    });
  });
  

  it("should respond failure when some error occurs", async () => {
    sandbox
      .mock(db)
      .expects("execute")
      .withArgs(
        verifyArgs((query) => {
          expect(query).to.be.instanceOf(CreateUserQuery);
        })
      )
      .returns(resolveError("some error occurred"));

    const response = await TestRoutes.executeWithError( "/users","Post",req,res);
     expect(response).to.be.eql({
        code:500,
        error: 'some error occurred',
        errorMessage: 'Failed to create users!',
        errorDescription: 'Internal Server Error'
      });
  });
   


  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
