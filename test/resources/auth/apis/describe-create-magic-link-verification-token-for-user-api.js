const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const TestRoutes = require("helpers/test-route");
chai.use(sinonChai);
const { uuid, ApiError } = require("lib");
const db = require("db/repository");
const config = require('config/config');

const {
    resolveOk,
} = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');

describe("describe create magic link verification token api", () => {
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
        it("should create magic link verification token for existing user", async () => {
            const { email, mlVerificationToken, mlVerificationTokenExp } = req.body;
            const user = {
                update: (args) => {
                    expect(args).to.be.eqls({
                        mlVerificationToken, mlVerificationTokenExp
                    });
                }
            }
            sandbox
                .mock(uuid)
                .expects("v4").returns('id');

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
                            where: { email }, defaults: { id: 'id', email, mlVerificationToken, mlVerificationTokenExp }
                        });
                    })
                )
                .returns(resolveOk([user, false]));

            const response = await TestRoutes.execute("/ml-verification-token", "Post", req, res);

            expect(response).to.be.eql({
                status: true,
                message: "Successfully created magic link verification token for user!",
                entity: 'ok',
            });
        });

        it("should create magic link verification token", async () => {
            const { email, mlVerificationToken, mlVerificationTokenExp } = req.body;
            const user = {

            }
            sandbox
                .mock(uuid)
                .expects("v4").returns('id');

            sandbox
                .mock(db)
                .expects("executeWithValue")
                .withArgs(
                    verifyArgs((args) => {
                        expect(args).to.be.instanceOf(CreateOrFindUserQuery);
                        expect(args).to.be.eqls({
                            where: { email }, defaults: { id: 'id', email, mlVerificationToken, mlVerificationTokenExp }
                        });
                    })
                )
                .returns(resolveOk([user, true]));

            const response = await TestRoutes.execute("/ml-verification-token", "Post", req, res);

            expect(response).to.be.eql({
                status: true,
                message: "Successfully created magic link verification token for user!",
                entity: 'ok',
            });
        });
    })

    context('error', async () => {
        it("should not create magic link verification token when there is mismatch of secret pass", async () => {
            req.body.nextAuthSecretPass = 'wrong pass';

            const response = await TestRoutes.executeWithError("/ml-verification-token", "Post", req, res);

            expect(response).to.be.eqls(new ApiError('api error', 'Not Authorized', 400));
        });
    })

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
