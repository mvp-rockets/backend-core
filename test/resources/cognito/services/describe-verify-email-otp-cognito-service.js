const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const verifiers = require("helpers/verifiers");
const { expect } = chai;
chai.use(sinonChai);
const VerifyPhoneWithOtpCognitoService = require('resources/cognito/services/verify-email-otp-cognito-service');
const CongnitoClient = require('resources/cognito/services/get-cognito-client');

describe("verift otp  cognito service", () => {
    const sandbox = sinon.createSandbox();
    let req;
    let res;
    let cognitoClient;

    beforeEach(() => {
        cognitoClient = {
            respondToAuthChallenge: (conf, cb) => {
                cb(false, 'done');
            }
        }
    });

    it("should verify otp", async () => {
        sandbox.mock(CongnitoClient).expects('getCognitoCLient').returns(cognitoClient)

        const response = await VerifyPhoneWithOtpCognitoService.verify({email: 'email@som.com', session:'fadgdag4cdfafac432vss', code:'1111'});
        verifiers.verifyResultOk((result) => {
            expect(result).to.be.eql('done')
        })(response);
    });


    it("should return error ", async () => {
        cognitoClient={
            respondToAuthChallenge: (conf, cb) => {
                cb({code:'abcd', message: 'abcd.'}, 'error');
            }
        }
        sandbox.mock(CongnitoClient).expects('getCognitoCLient').returns(cognitoClient)


        const response = await VerifyPhoneWithOtpCognitoService.verify({email: 'email@som.com', session:'fadgdag4cdfafac432vss', code:'1111'});
        verifiers.verifyResultError((result) => {
            expect(result).to.be.eql({code:'abcd', message: 'abcd.'})
        })(response);
    });

    it("should return error when exception ", async () => {
        cognitoClient={
            respondToAuthChallenge: (conf, cb) => {

                throw new Error('abcd')
            }
        }
        sandbox.mock(CongnitoClient).expects('getCognitoCLient').returns(cognitoClient)

        const response = await VerifyPhoneWithOtpCognitoService.verify({email: 'email@som.com', session:'fadgdag4cdfafac432vss', code:'1111'});
        verifiers.verifyResultError((result) => {
            expect(result).to.be.eql(new Error('abcd'))
        })(response);
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
