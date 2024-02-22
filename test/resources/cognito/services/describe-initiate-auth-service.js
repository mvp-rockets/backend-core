const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { resolveOk, resolveError } = require("helpers/resolvers");
const verifiers = require("helpers/verifiers");
const { expect } = chai;
chai.use(sinonChai);
const InitiateAuth = require('resources/cognito/services/initiate-cognito-custom-auth-service.js');
const InitiateAuthService = require('resources/cognito/services/initiate-auth-service');

describe("Initiate auth service", () => {
    const sandbox = sinon.createSandbox();
    let details;

    beforeEach(() => {
        details = {
            mobile: '+916205363035',
            user: {
                id: 'id'
            },
            isNew: false,
            session: 'session'
        }
    });

    it("should initiate auth", async () => {
        sandbox.mock(InitiateAuth).expects('initiate').returns(resolveOk({
            user: {
                id: 'id'
            },
            Session: 'hhhhh'
        }))

        const response = await InitiateAuthService.initiateAuth(details);
        verifiers.verifyResultOk((result) => {
            expect(result).to.be.eql({
                session: 'hhhhh',
            })
        })(response);
    });


    it("should throw error when user allready exist in userpool", async () => {
        sandbox
            .mock(InitiateAuth)
            .expects("initiate")
            .returns(resolveError(error = {
                code: 'Something'
            }));


        const response = await InitiateAuthService.initiateAuth(details);
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
