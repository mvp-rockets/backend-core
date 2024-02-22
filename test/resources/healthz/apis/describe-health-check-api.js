const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const TestRoutes = require("helpers/test-route");
const { expect } = chai;
chai.use(sinonChai);

describe("Get health api", () => {
    const sandbox = sinon.createSandbox();
    let req;
    let res;

    beforeEach(() => {
        req = {};
        res = {
            setHeader: sandbox.spy(),
            send: sandbox.spy(),
            status: sandbox.spy(() => res),
        };

    });

    it("should return is healthy true", async () => {

        const response = await TestRoutes.execute('/healthz', "Get", req, res);

        expect(response).to.eql({
            status: true,
            message: "Successfully checked health api!",
            entity: { isHealthy: true },
        });
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
