const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { resolveOk, resolveError } = require("helpers/resolvers");
const verifiers = require("helpers/verifiers");
const { expect } = chai;
chai.use(sinonChai);
const CreateCognitoUserService = require('resources/cognito/services/create-cognito-user-service.js');
const InitiateAuth = require('resources/cognito/services/initiate-cognito-custom-auth-service.js');
const CreateAndInitiateAuthService = require('resources/cognito/services/create-and-initiate-auth-service');

describe("Create and initiate auth service", () => {
    const sandbox = sinon.createSandbox();
    let req;
    let res;
    let details;

    beforeEach(() => {
        details = {
            email: "somee@gmail.com",
        }
    });

    it("should create user and initiate auth", async () => {
        sandbox
            .mock(CreateCognitoUserService)
            .expects("create")
            .returns(resolveOk(
                {
                    user: {
                        id: 'id'
                    }
                }
            ));

        sandbox.mock(InitiateAuth).expects('initiate').returns(resolveOk({
            user: {
                id: 'id'
            },
            Session: 'hhhhh'
        }))

        const response = await CreateAndInitiateAuthService.createInitiateAuth(details);

        verifiers.verifyResultOk((result) => {
            expect(result).to.be.eql({
                session: 'hhhhh',
            })
        })(response);
    });

    it("should throw error when user allready exist in userpool", async () => {
        sandbox
            .mock(CreateCognitoUserService)
            .expects("create")
            .returns(resolveError(error = {
                code: 'UsernameExistsException'
            }));

        sandbox.mock(InitiateAuth).expects('initiate').returns(resolveOk({
            user: {
                id: 'id'
            },
            Session: 'hhhhh'
        }))

        const response = await CreateAndInitiateAuthService.createInitiateAuth(details);

        verifiers.verifyResultOk((result) => {
            expect(result).to.be.eql({
                session: 'hhhhh',
            })
        })(response);
    });

    it("should throw error when user allready exist in userpool", async () => {
        sandbox
            .mock(CreateCognitoUserService)
            .expects("create")
            .returns(resolveError(error = {
                code: 'Something'
            }));

        sandbox.mock(InitiateAuth).expects('initiate').never();

        const response = await CreateAndInitiateAuthService.createInitiateAuth(details);

        verifiers.verifyResultError((result) => {
            expect(result).to.be.eql({
                code: 'Something'
            })
        })(response);
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
