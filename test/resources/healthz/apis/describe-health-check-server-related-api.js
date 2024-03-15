const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const TestRoutes = require("helpers/test-route");
const { expect } = chai;
chai.use(sinonChai);

const { ApiError } = require('lib')
const { resolveOk, resolveError } = require("helpers/resolvers");

const CheckDbHealthService = require('resources/healthz/services/check-db-health-service');
const redis = require('utils/redis');

describe("Get health server api", () => {
    const sandbox = sinon.createSandbox();
    let req;
    let res;
    let responseResult;

    beforeEach(() => {
        req = { params: { type: 'db' } };
        res = {
            setHeader: sandbox.spy(),
            send: sandbox.spy(),
            status: sandbox.spy(() => res),
        };

    });

    it("should check healthy server for db", async () => {
        const response = await TestRoutes.execute('/healthz/:type', "Get", req, res);

        expect(response).to.eql({
            status: true,
            message: "Successfully checked server health api!",
            entity: { isAlive: true },
        });
    });

    it("should check healthy server for redis", async () => {
        req.params.type = 'redis';

        const response = await TestRoutes.execute('/healthz/:type', "Get", req, res);

        expect(response).to.eql({
            status: true,
            message: "Successfully checked server health api!",
            entity: { isAlive: true },
        });
    });

    it("should return is healthy server for db true", async () => {
        sandbox.mock(CheckDbHealthService).expects('isDbAlive').returns(resolveOk({ isHealthy: true }));

        const response = await TestRoutes.execute('/healthz/:type', "Get", req, res);

        expect(response).to.eql({
            status: true,
            message: "Successfully checked server health api!",
            entity: { isHealthy: true },
        });
    });

    it("should return error when db service fails", async () => {
        sandbox.mock(CheckDbHealthService).expects('isDbAlive').returns(resolveError('some error'));

        const response = await TestRoutes.executeWithError('/healthz/:type', "Get", req, res);

        expect(response).to.be.eql(new ApiError('some error', 'Failed to check server health api!', 500));
    });


    it("should return error when unkonwn type", async () => {
        req.params.type = 'unkown';

        const response = await TestRoutes.executeWithError('/healthz/:type', "Get", req, res);

        expect(response).to.be.eql(new ApiError('Invalid request type', 'Failed to check server health api!', 500));
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
