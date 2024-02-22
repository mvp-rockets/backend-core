const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { resolveOk, resolveError } = require("helpers/resolvers");
const verifiers = require("helpers/verifiers");
const { expect } = chai;
chai.use(sinonChai);
const InitiateAuth = require('resources/cognito/services/initiate-cognito-custom-auth-service.js');
const CongnitoClient = require('resources/cognito/services/get-cognito-client');
const CreateCognitoUserService = require('resources/cognito/services/create-cognito-user-service.js');

describe("Initiate cognito custom auth service", () => {
    const sandbox = sinon.createSandbox();
    let req;
    let res;
    let cognitoClient;

    beforeEach(() => {
        cognitoClient = {
            initiateAuth: (conf, cb) => {
                cb(false, 'done');
            }
        }
    });

    it("should initiate auth", async () => {
        sandbox.mock(CongnitoClient).expects('getCognitoCLient').returns(cognitoClient)

        const response = await InitiateAuth.initiate({ email: 'someemail@gmail.com' });
        verifiers.verifyResultOk((result) => {
            expect(result).to.be.eql('done')
        })(response);
    });

    it("should create new user auth", async () => {
        cognitoClient = {
            initiateAuth: (conf, cb) => {
                cb({ code: 'NotAuthorizedException', message: 'Incorrect username or password.' }, 'error');
            }
        }
        sandbox.mock(CongnitoClient).expects('getCognitoCLient').returns(cognitoClient)
        sandbox.mock(CreateCognitoUserService).expects('create').returns(resolveOk('done'));


        const response = await InitiateAuth.initiate({ email: 'someemail@gmail.com' });
        verifiers.verifyResultError((result) => {
            expect(result).to.be.eql({ code: 'userWasNotRegisteredException' })
        })(response);
    });

    it("should create new user error ", async () => {
        cognitoClient = {
            initiateAuth: (conf, cb) => {
                cb({ code: 'NotAuthorizedException', message: 'Incorrect username or password.' }, 'error');
            }
        }
        sandbox.mock(CongnitoClient).expects('getCognitoCLient').returns(cognitoClient)
        sandbox.mock(CreateCognitoUserService).expects('create').returns(resolveError('error'));


        const response = await InitiateAuth.initiate({ email: 'someemail@gmail.com' });
        verifiers.verifyResultError((result) => {
            expect(result).to.be.eql('error')
        })(response);
    });
    it("should return error when diff error code ", async () => {
        cognitoClient = {
            initiateAuth: (conf, cb) => {
                cb({ code: 'abcd', message: 'abcd.' }, 'error');
            }
        }
        sandbox.mock(CongnitoClient).expects('getCognitoCLient').returns(cognitoClient)


        const response = await InitiateAuth.initiate({ email: 'someemail@gmail.com' });
        verifiers.verifyResultError((result) => {
            expect(result).to.be.eql({ code: 'abcd', message: 'abcd.' })
        })(response);
    });
    it("should return error when exception ", async () => {
        cognitoClient = {
            initiateAuth: (conf, cb) => {

                throw new Error('abcd')
            }
        }
        sandbox.mock(CongnitoClient).expects('getCognitoCLient').returns(cognitoClient)

        const response = await InitiateAuth.initiate({ email: 'someemail@gmail.com' });
        verifiers.verifyResultError((result) => {
            expect(result).to.be.eql(new Error('abcd'))
        })(response);
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
