const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const verifiers = require("helpers/verifiers");
const { expect } = chai;
const CreateCognitoUserService = require('resources/cognito/services/create-cognito-user-service');
const CongnitoClient = require('resources/cognito/services/get-cognito-client');

chai.use(sinonChai);
describe("create cognito user service", () => {
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
    });

    it("Successfully create cognito user service", async () => {
        sandbox.stub(CongnitoClient, 'getCognitoCLient').returns(
            { signUp: (a, b) => { b(false,'abcd') } }
        );
        const response = await CreateCognitoUserService.create({ email: 'someemail@gmail.com' });

        verifiers.verifyResultOk((result) => {
            expect(result).to.be.eql("abcd");
        })(response);
    });

    it("fail create cognito user service", async () => {
        sandbox.stub(CongnitoClient, 'getCognitoCLient').returns(
            { signUp: (a, b) => { b('signup falied') } }
        );
        const response = await CreateCognitoUserService.create({ email: 'someemail@gmail.com' });

        verifiers.verifyResultError((result) => {
            expect(result).to.be.eql("signup falied");
        })(response);
    });

    it("should return error when exception ", async () => {
        sandbox.mock(CongnitoClient).expects('getCognitoCLient').returns({
            signUp: (conf, cb) => {

                throw new Error('abcd')
            }
        })

        const response = await CreateCognitoUserService.create({ email: 'someemail@gmail.com' });
        verifiers.verifyResultError((result) => {
            expect(result).to.be.eql(new Error('abcd'))
        })(response);
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
