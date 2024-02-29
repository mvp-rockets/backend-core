const { HTTP_CONSTANT } = require("@mvp-rockets/namma-lib");
const { ApiError } = require("lib");
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const TestRoutes = require("helpers/test-route");
const { resolveOk, resolveError } = require("helpers/resolvers");
const { expect } = chai;
chai.use(sinonChai);
const GenerateNewTokenService = require('resources/cognito/services/get-new-token-service');

describe("Get new tokens from refresh token api", () => {
    const sandbox = sinon.createSandbox();
    let req;
    let res;
    let responseResult;

    beforeEach(() => {
        req = { body: { refreshToken: "refreshToken", userId: "userId" } };
        res = {
            setHeader: sandbox.spy(),
            send: sandbox.spy(),
            status: sandbox.spy(() => res),
        };
        responseResult = {
            id: "id",
            fullName: "Daraz",
            authTokens: {
                "access_token": "access_token",
                "id_token": "id_token"
            }
        };
    });

    it("should return new auth tokens for valid refreshToken", async () => {
        sandbox
            .mock(GenerateNewTokenService)
            .expects("generate")
            .returns(resolveOk({
                id_token: "id_token",
                access_token: "access_token"
            }));

        const response = await TestRoutes.execute('/refresh-tokens', "Post", req, res);

        expect(response).to.eql({
            status: true,
            message: "Successfully get new access tokens!",
            entity: {
                "access_token": "access_token",
                "id_token": "id_token"
            },
        });
    });


    it("Should throw error if query fails", async () => {
        sandbox
            .mock(GenerateNewTokenService)
            .expects("generate")
            .returns(resolveError("Some random error!"));

        const response = await TestRoutes.executeWithError("/refresh-tokens", "Post", req, res);

        expect(response).to.eql(new ApiError("Some random error!", "Failed to get new access tokens!", HTTP_CONSTANT.INTERNAL_SERVER_ERROR));
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
