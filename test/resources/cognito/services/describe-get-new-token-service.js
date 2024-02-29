const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const verifiers = require("helpers/verifiers");
const { expect } = chai;

chai.use(sinonChai);
const axios = require("axios").default;
const GenerateNewTokenService = require('resources/cognito/services/get-new-token-service');

describe("generate new token service", () => {
    const sandbox = sinon.createSandbox();
    beforeEach(() => {

    });

    it("should generate new tokens for a valid refresh tokens", async () => {
        sandbox.mock(axios).expects('request').returns({
            data: {
                id_token: "id_token",
                access_token: "access_token"
            }
        })

        const response = await GenerateNewTokenService.generate({ refreshToken: 'refreshToken' })
        verifiers.verifyResultOk(
            (result) => {
                expect(result.id_token).to.be.eql("id_token");
                expect(result.access_token).to.be.eql("access_token")
            }
        )(response)

    });

    it("should generate new tokens for a valid refresh tokens", async () => {
        sandbox.mock(axios).expects("request").returns(Promise.reject("Some Error"));

        const response = await GenerateNewTokenService.generate({ refreshToken: 'refreshToken' })
        verifiers.verifyResultError(
            (result) => {
                expect(result).to.be.eql('Some Error');
            }
        )(response)

    });
    
    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
