const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const TestRoutes = require("helpers/test-route");
chai.use(sinonChai);
const { ApiError, token: TokenService } = require("lib");
const db = require("db/repository");
const config = require('config/config');

const { resolveOk, resolveError } = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const bcrypt = require('bcryptjs');
const GetOneUserByConditionQuery = require('resources/users/queries/get-one-user-by-condition-query');

describe("verify login otp api", () => {
    let sandbox = sinon.createSandbox();
    let req, res; let user;

    beforeEach(() => {

        user = {
            id: 'id',
            email: 'email',
        }
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
        it("should verify login otp for valid otp", async () => {
            const { email } = req.body;
            const token = 'token'


            sandbox
                .mock(TokenService)
                .expects("generate").withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.eqls({
                            id: user.id, email: user.email
                        });
                    })
                ).returns(resolveOk(token));

            sandbox
                .mock(bcrypt)
                .expects("compare").returns(true);

            sandbox
                .mock(db)
                .expects("executeWithValue")
                .withArgs(
                    verifyArgs((args) => {
                        console.log('args', args)
                        expect(args).to.be.instanceOf(GetOneUserByConditionQuery);
                        expect(args).to.be.eqls({
                            where: { email: email.toLowerCase() }
                        });
                    })
                )
                .returns(resolveOk(user));

            const response = await TestRoutes.execute("/verify-login-otp", "Post", req, res);

            expect(response).to.be.eql({
                status: true,
                message: "Verified otp successfully!",
                entity: { token },
            });
        });
    })

    context('error', async () => {
        it("should not verify login otp if otp is not valid", async () => {
            const { email } = req.body;

            sandbox
                .mock(db)
                .expects("executeWithValue")
                .withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.instanceOf(GetOneUserByConditionQuery);
                        expect(args).to.be.eqls({
                            where: { email: email.toLowerCase() }
                        });
                    })
                )
                .returns(resolveOk(user));

            sandbox
                .mock(bcrypt)
                .expects("compare").returns(false);

            const response = await TestRoutes.executeWithError("/verify-login-otp", "Post", req, res);

            expect(response).to.be.eqls(new ApiError('api error', 'Invalid OTP', 400));

        });

        it("should not verify login otp if query fails", async () => {
            const { email } = req.body;

            sandbox
                .mock(db)
                .expects("executeWithValue")
                .withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.instanceOf(GetOneUserByConditionQuery);
                        expect(args).to.be.eqls({
                            where: { email: email.toLowerCase() }
                        });
                    })
                )
                .returns(resolveError('some error'));

            const response = await TestRoutes.executeWithError("/verify-login-otp", "Post", req, res);

            expect(response).to.be.eqls(new ApiError('some error', 'failed to verify otp!', 500));

        });
    })

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
