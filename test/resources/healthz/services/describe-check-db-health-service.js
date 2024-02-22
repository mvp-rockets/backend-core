const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const verifiers = require("helpers/verifiers");
const { expect } = chai;
const HealthDbService = require('resources/healthz/services/check-db-health-service');
const { sequelize } = require('models');

chai.use(sinonChai);
describe("Check db health service", () => {
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
    });

    it("should return alive true", async () => {
        sandbox.mock(sequelize,).expects('authenticate').resolves({});

        const response = await HealthDbService.isDbAlive();

        verifiers.verifyResultOk((result) => {
            expect(result).to.be.eqls({
                isAlive: true
            });
        })(response);
    });

    it("should return alive false", async () => {
        sandbox.mock(sequelize,).expects('authenticate').rejects(new Error('some error'));

        const response = await HealthDbService.isDbAlive();

        verifiers.verifyResultError((result) => {
            expect(result).to.be.eqls({
                error: new Error('some error'),
                isAlive: false
            });
        })(response);
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });
});
