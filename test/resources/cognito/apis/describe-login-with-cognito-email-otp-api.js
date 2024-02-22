const { uuid } = require("lib");
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const TestRoutes = require("helpers/test-route");
const db = require("db/repository");
const { resolveOk, resolveError } = require("helpers/resolvers");
const verifiers = require("helpers/verifiers");
const { expect } = chai;
chai.use(sinonChai);

const CreateInitiateAuth = require("resources/cognito/services/create-and-initiate-auth-service");
const InitiateAuth = require("resources/cognito/services/initiate-auth-service");
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');

describe("login or signup with phone API", () => {
    const sandbox = sinon.createSandbox();
    let req;
    let res;
    let responseResult; const session = 'session';

    beforeEach(() => {
        sandbox.stub(uuid, 'v4').returns(resolveOk('id'));
        req = {
            body: {
                "email": "somee@gmail.com",
            }
        };
        res = {
            setHeader: sandbox.spy(),
            send: sandbox.spy(),
            status: sandbox.spy(() => res),
        };
        responseResult = {
            user: {
                id: "id",
                name: "sanjeev",
                isRegistered: true,
                Patient: {
                    id: 'id'
                }
            },
            isNew: true,
            session: 'session'
        };
    });

    it("should customer login with email when user is old", async () => {
        sandbox
            .mock(db)
            .expects("executeWithValue")
            .withArgs(
                verifiers.verifyArgs((args) => {
                    expect(args).to.be.instanceOf(CreateOrFindUserQuery);
                })
            )
            .returns(resolveOk([responseResult.user, false]));

        sandbox
            .mock(InitiateAuth)
            .expects("initiateAuth")
            .withArgs(
                verifiers.verifyArgs((args) => {
                    expect(args).to.be.eql({
                        email: req.body.email,
                    });
                })
            )
            .returns(resolveOk(responseResult));

        const response = await TestRoutes.execute("/login-with-cognito-email-otp", "Post", req, res);

        expect(response).to.eql({
            status: true,
            message: "Successfully auth started logging in with email!",
            entity: {
                ...responseResult
            },
        });
    });


    it("should customer login with email when user is new", async () => {
        sandbox
            .mock(db)
            .expects("executeWithValue")
            .withArgs(
                verifiers.verifyArgs((args) => {
                    expect(args).to.be.instanceOf(CreateOrFindUserQuery);
                })
            )
            .returns(resolveOk([responseResult.user, true]));

        sandbox
            .mock(CreateInitiateAuth)
            .expects("createInitiateAuth")
            .withArgs(
                verifiers.verifyArgs((args) => {
                    expect(args).to.be.eql({
                        email: req.body.email,
                    });
                })
            )
            .returns(resolveOk(responseResult));

        const response = await TestRoutes.execute("/login-with-cognito-email-otp", "Post", req, res);

        expect(response).to.eql({
            status: true,
            message: "Successfully auth started logging in with email!",
            entity: {
                ...responseResult
            },
        });
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
