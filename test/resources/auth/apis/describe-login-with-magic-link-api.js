const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const TestRoutes = require("helpers/test-route");
chai.use(sinonChai);
const { ApiError } = require("lib");
const { resolveOk, resolveError } = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const SendMagicLinkService = require('resources/auth/services/send-magic-link-via-email-service');
const LoginMagicLinkValidation = require('resources/auth/validators/login-with-magic-link-validation');

describe("login with magic link api", () => {
    let sandbox = sinon.createSandbox();
    let req, res;
    beforeEach(() => {

        req = {
            body: {
                to: 'some email', theme: {}, url: 'some url'
            },
        };
        res = {
            setHeader: sandbox.spy(),
            send: sandbox.spy(),
            status: sandbox.spy(() => {
                return res;
            }),
        };
    });
    context('success', async () => {
        it("should login with magic link", async () => {
            const { to, theme, url } = req.body;


            sandbox
                .mock(SendMagicLinkService)
                .expects("send")
                .withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.eqls({
                            to, theme, url
                        });
                    })
                )
                .returns(resolveOk('ok'));

            sandbox
                .mock(LoginMagicLinkValidation)
                .expects("validate")
                .withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.eqls({
                            to, theme, url
                        });
                    })
                )
                .returns(resolveOk([]));

            const response = await TestRoutes.execute("/magic-link", "Post", req, res);

            expect(response).to.be.eql({
                status: true,
                message: "Successfully created and sent magic link!",
                entity: 'ok',
            });
        });
    })

    context('error', async () => {
        it("should not login with magic link", async () => {
            const { to, theme, url } = req.body;
          
            sandbox
                .mock(LoginMagicLinkValidation)
                .expects("validate")
                .withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.eqls({
                            to, theme, url
                        });
                    })
                )
                .returns(resolveError('some error'));

            const response = await TestRoutes.executeWithError("/magic-link", "Post", req, res);

            expect(response).to.be.eqls(new ApiError('some error', 'Failed to create and send magic link!', 500));
        });
    })

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
