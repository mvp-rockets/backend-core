const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const TestRoutes = require("helpers/test-route");
chai.use(sinonChai);
const { ApiError } = require("lib");
const db = require("db/repository");
const { resolveOk, resolveError } = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');
const config = require('config/config');

describe("Get user for next auth api", () => {
    let sandbox = sinon.createSandbox();
    let req, res; let user;
    beforeEach(() => {
        user = {
            id: 'id',
            username: "dheeraj",
            password: "dheeraj123"
        }
        req = {
            query: {
                nextAuthSecretPass: config.nextAuthSecretPass,
                email: "dheeraj@gmail.com",
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

    context('success', () => {
        it("should get user", async () => {
            const { email } = req.query;

            sandbox
                .mock(db)
                .expects("executeWithValue")
                .withArgs(
                    verifyArgs((query) => {
                        expect(query).to.be.instanceOf(CreateOrFindUserQuery);
                        expect(query).to.have.eqls({
                            where: { email: email.toLowerCase() },
                            defaults: {}
                        });
                    })
                )
                .returns(resolveOk([user]));

            const response = await TestRoutes.execute("/user-next-auth", "Get", req, res);

            expect(response).to.be.eql({
                status: true,
                message: "Successfully got user for next auth!",
                entity: user,
            });
        });
    })

    context('error', () => {
        it("should not get user if wrong secret pass", async () => {
            req.query.nextAuthSecretPass = 'wrong pass key';

            const response = await TestRoutes.executeWithError("/user-next-auth", "Get", req, res);

            expect(response).to.be.eql(new ApiError('api error', 'Not Authorized', 400));
        });

        it("should not get user if query fails", async () => {
            const { email } = req.query;

            sandbox
                .mock(db)
                .expects("executeWithValue")
                .withArgs(
                    verifyArgs((query) => {
                        expect(query).to.be.instanceOf(CreateOrFindUserQuery);
                        expect(query).to.have.eqls({
                            where: { email: email.toLowerCase() },
                            defaults: {}
                        });
                    })
                )
                .returns(resolveError('some error'));

            const response = await TestRoutes.executeWithError("/user-next-auth", "Get", req, res);

            expect(response).to.be.eql(new ApiError('some error', 'Failed to get user for next auth!', 500));
        });
    })

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
