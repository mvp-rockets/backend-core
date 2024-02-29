const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const TestRoutes = require("helpers/test-route");
chai.use(sinonChai);
const { token: TokenService, ApiError } = require("lib");
const db = require("db/repository");
const config = require('config/config');

const {
    resolveOk,
} = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');

describe("describe verify magic link verification token api", () => {
    let sandbox = sinon.createSandbox();
    let req, res;
    beforeEach(() => {

        req = {
            body: {
                email: 'email',
                nextAuthSecretPass: config.nextAuthSecretPass,
                mlVerificationToken: 'some token',
                mlVerificationTokenExp: 'some date'
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
        it("should verify magic link verification token for existing user", async () => {
            const { email, mlVerificationToken } = req.body;
            const generatedToken = 'some token';

            const user = {
                id: 'user id',
                update: (args) => {
                    expect(args).to.be.eqls({
                        mlVerificationToken: generatedToken, mlVerificationTokenExp: null
                    });
                },
                mlVerificationToken,
                mlVerificationTokenExp: new Date(new Date().getTime() + 1000 * 3600 * 6)
            }
            sandbox
                .mock(db)
                .expects("perform").returns(resolveOk(user));

            sandbox
                .mock(db)
                .expects("executeWithValue")
                .withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.instanceOf(CreateOrFindUserQuery);
                        expect(args).to.be.eqls({
                            where: { email }, defaults: {}
                        });
                    })
                )
                .returns(resolveOk([user, false]));

            sandbox
                .mock(TokenService)
                .expects("generate").withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.eqls({
                            id: user.id, email
                        });
                    })
                ).returns(resolveOk(generatedToken));


            const response = await TestRoutes.execute("/verify-ml-verification-token", "Post", req, res);

            expect(response).to.be.eql({
                status: true,
                message: "Successfully verified magic link verification token for user!",
                entity: {
                    email: user.email,
                    mlVerificationToken: user.mlVerificationToken,
                    mlVerificationTokenExp: user.mlVerificationTokenExp
                },
            });
        });
    })

    context('error', async () => {
        it("should not verify magic link verification token when there is mismatch of secret pass", async () => {
            req.body.nextAuthSecretPass = 'wrong pass';

            const response = await TestRoutes.executeWithError("/verify-ml-verification-token", "Post", req, res);

            expect(response).to.be.eqls(new ApiError('api error', 'Not Authorized', 400));
        });

        it("should not verify magic link verification token when token is invalid or expired", async () => {
            const { email } = req.body;
            const user = {
                update: (args) => {},
                mlVerificationToken: 'wrong token',
                mlVerificationTokenExp: new Date(new Date().getTime() + 1000 * 3600 * 6)
            }

            sandbox
                .mock(db)
                .expects("executeWithValue")
                .withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.instanceOf(CreateOrFindUserQuery);
                        expect(args).to.be.eqls({
                            where: { email }, defaults: {}
                        });
                    })
                )
                .returns(resolveOk([user]));

            const response = await TestRoutes.executeWithError("/verify-ml-verification-token", "Post", req, res);

            expect(response).to.be.eqls(new ApiError('api error', 'Token is invalid or expired', 400));
        });
    })

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
