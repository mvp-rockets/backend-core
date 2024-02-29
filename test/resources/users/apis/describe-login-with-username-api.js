const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { expect } = chai;
const TestRoutes = require("helpers/test-route");
chai.use(sinonChai);
const { uuid, token: TokenService, ApiError } = require("lib");
const db = require("db/repository");
const { resolveOk } = require("helpers/resolvers");
const { verifyArgs } = require("helpers/verifiers");
const CreateOrFindUserQuery = require('resources/users/queries/create-or-find-user-query');
const bcrypt = require('bcryptjs');

describe("Login with username api", () => {
    let sandbox = sinon.createSandbox();
    let req, res; let user;
    beforeEach(() => {
        user = {
            id: 'id',
            username: "dheeraj",
            password: "dheeraj123"
        }
        req = {
            body: {
                username: "dheeraj",
                password: "dheeraj123"
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
        it("should login correct credentials", async () => {
            const { username, password } = req.body;
            const uuidId = 'uuid';
            const hashedPassword = 'hashed';
            const token = 'token';
            sandbox
                .mock(uuid)
                .expects("v4")
                .returns(uuidId);

            sandbox
                .mock(bcrypt)
                .expects("hashSync")
                .returns(hashedPassword);

            sandbox
                .mock(bcrypt)
                .expects("compare")
                .returns(true);

            sandbox
                .mock(db)
                .expects("execute")
                .withArgs(
                    verifyArgs((query) => {
                        expect(query).to.be.instanceOf(CreateOrFindUserQuery);
                        expect(query).to.have.eqls({
                            where: { username },
                            defaults: { id: uuidId, username, password: hashedPassword }
                        });
                    })
                )
                .returns(resolveOk([user]));

            sandbox
                .mock(TokenService)
                .expects("generate").withArgs(
                    verifyArgs((args) => {
                        expect(args).to.have.eqls({
                            id: user.id, username
                        });
                    })
                )
                .returns(resolveOk(token));

            const response = await TestRoutes.execute("/login-with-username", "Post", req, res);

            expect(response).to.be.eql({
                status: true,
                message: "User logged in with username successfully",
                entity: { token },
            });
        });
    })

    context('error', () => {
        it("should not login if credentials are not correct", async () => {
            const { username } = req.body;
            const uuidId = 'uuid';
            const hashedPassword = 'hashed';
            sandbox
                .mock(uuid)
                .expects("v4")
                .returns(uuidId);

            sandbox
                .mock(bcrypt)
                .expects("hashSync")
                .returns(hashedPassword);

            sandbox
                .mock(bcrypt)
                .expects("compare")
                .returns(false);

            sandbox
                .mock(db)
                .expects("execute")
                .withArgs(
                    verifyArgs((query) => {
                        expect(query).to.be.instanceOf(CreateOrFindUserQuery);
                        expect(query).to.have.eqls({
                            where: { username },
                            defaults: { id: uuidId, username, password: hashedPassword }
                        });
                    })
                )
                .returns(resolveOk([user]));

            const response = await TestRoutes.executeWithError("/login-with-username", "Post", req, res);

            expect(response).to.be.eql(new ApiError('api error', 'Invalid username or password', 400));
        });
    })

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
