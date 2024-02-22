const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { resolveOk } = require("helpers/resolvers");
const verifiers = require("helpers/verifiers");
const { expect } = chai;
chai.use(sinonChai);
const VerifyOtpService = require('resources/cognito/services/verify-otp-service');
const VerifyEmailWithOtpCognitoService = require('resources/cognito/services/verify-email-otp-cognito-service');

describe("Verify otp service", () => {
    const sandbox = sinon.createSandbox();
    let req;

    beforeEach(() => {
        req = { body: { session: 'fdsafdsfdsafdsafsaff', code: '1111', email: 'email@some.com' } };
        
    });

    it("should return new auth tokens for valid otp", async () => {
        sandbox
            .mock(VerifyEmailWithOtpCognitoService)
            .expects("verify")
            .returns(resolveOk({
                AuthenticationResult:
                {
                    IdToken: "id_token",
                    AccessToken: "access_token",
                    RefreshToken: "refresh_token"
                }
            }));

        const response = await VerifyOtpService.verify(req);

        verifiers.verifyResultOk((res) => {
            expect(res).to.eql({
                id_token: "id_token",
                access_token: "access_token",
                refresh_token: "refresh_token"
            });
        })(response);

    });
    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
