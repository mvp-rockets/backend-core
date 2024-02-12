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
const GetAllUsersQuery = require("resources/users/queries/get-users-query");

describe("describe get allusers api", () => {
  let sandbox = sinon.createSandbox();
  let req, res;
  beforeEach(() => {
    
    req = {};
    res = {
      setHeader: sandbox.spy(),
      send: sandbox.spy(),
      status: sandbox.spy(() => {
        return res;
      }),
    };
  });

  it("should get all users with correct api", async () => {
    sandbox
    .mock(db)
    .expects("find")
    .withArgs(new GetAllUsersQuery())
    .returns(
      resolveOk([
        {
          username: "dheeraj",
          password: "dheeraj123",
        },
        {
            username: "neeraj",
            password: "neeraj1234",
          },
      ])
    );

    const response = await TestRoutes.execute("/users", "Get", req, res);
 

    expect(response).to.be.eql({
      status: true,
      message: "Successfully get users!",
      entity:[ {
        username: "dheeraj",
        password: "dheeraj123",
      },
      {
        username: "neeraj",
        password: "neeraj1234",
      },
    ]
    });
  });

  it("should not get users when wrong api provided", async () => {
    sandbox
    .mock(db)
    .expects("find")
    .withArgs(new GetAllUsersQuery())
    .returns(resolveError("Users not Found."));

  const response = await TestRoutes.executeWithError("/users", "Get", req, res);

  expect(response).to.be.eql({
    code:500,
    error: 'Users not Found.',
    errorMessage: 'Failed to get users!',
    errorDescription: 'Internal Server Error'
  });

});
  afterEach(() => {
    sandbox.verifyAndRestore();
  });
});
