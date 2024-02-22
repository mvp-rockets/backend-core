const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const TestRoutes = require("helpers/test-route");
chai.use(sinonChai);
const { uuid, ApiError, OtpService } = require("lib");
const db = require("db/repository");
const config = require('config/config');

const { resolveOk, resolveError } = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');
const bcrypt = require('bcryptjs');

describe("send login otp api", () => {
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
        it("should send login otp for existing user", async () => {
            const { email } = req.body;
            const hashedotp = 'otp'
            const id = 'id'

            const user = {
                update: (args) => {
                    expect(args).to.be.eqls({
                        mlVerificationToken: hashedotp
                    });
                }
            }

            sandbox
                .mock(OtpService)
                .expects("generate").returns('otp');
            sandbox
                .mock(db)
                .expects("perform").returns(resolveOk({}));
            sandbox
                .mock(uuid)
                .expects("v4").returns(id);

            sandbox
                .mock(bcrypt)
                .expects("hashSync").returns(hashedotp);

            sandbox
                .mock(db)
                .expects("executeWithValue")
                .withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.instanceOf(CreateOrFindUserQuery);
                        expect(args).to.be.eqls({
                            where: { email: email.toLowerCase() }, defaults: { id, email: email.toLowerCase(), mlVerificationToken: hashedotp }
                        });
                    })
                )
                .returns(resolveOk([user, false]));

            const response = await TestRoutes.execute("/login-otp", "Post", req, res);

            expect(response).to.be.eql({
                status: true,
                message: "Successfully sent login otp!",
                entity: 'ok',
            });
        });

        it("should send login otp for new user", async () => {
            const { email, mlVerificationToken, mlVerificationTokenExp } = req.body;

            const user = {
                update: (args) => {
                    expect(args).to.be.eqls({
                        mlVerificationToken, mlVerificationTokenExp
                    });
                }
            }
            const hashedotp = 'otp'
            const id = 'id'

            sandbox
                .mock(OtpService)
                .expects("generate").returns('otp');
            sandbox
                .mock(uuid)
                .expects("v4").returns(id);

            sandbox
                .mock(bcrypt)
                .expects("hashSync").returns(hashedotp);

            sandbox
                .mock(db)
                .expects("executeWithValue")
                .withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.instanceOf(CreateOrFindUserQuery);
                        expect(args).to.be.eqls({
                            where: { email: email.toLowerCase() }, defaults: { id, email: email.toLowerCase(), mlVerificationToken: hashedotp }
                        });
                    })
                )
                .returns(resolveOk([user, true]));

            const response = await TestRoutes.execute("/login-otp", "Post", req, res);

            expect(response).to.be.eql({
                status: true,
                message: "Successfully sent login otp!",
                entity: 'ok',
            });
        });
    })

    context('error', async () => {
        it("should not send login otp if query fails", async () => {
            const { email } = req.body;
            const hashedotp = 'otp'
            const id = 'id'

            sandbox
                .mock(OtpService)
                .expects("generate").returns('otp');
            sandbox
                .mock(uuid)
                .expects("v4").returns(id);

            sandbox
                .mock(bcrypt)
                .expects("hashSync").returns(hashedotp);

            sandbox
                .mock(db)
                .expects("executeWithValue")
                .withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.instanceOf(CreateOrFindUserQuery);
                        expect(args).to.be.eqls({
                            where: { email: email.toLowerCase() }, defaults: { id, email: email.toLowerCase(), mlVerificationToken: hashedotp }
                        });
                    })
                )
                .returns(resolveError('some error'));

            const response = await TestRoutes.executeWithError("/login-otp", "Post", req, res);

            expect(response).to.be.eqls(new ApiError('some error', 'Failed to send login otp!', 500));

        });
    })

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
